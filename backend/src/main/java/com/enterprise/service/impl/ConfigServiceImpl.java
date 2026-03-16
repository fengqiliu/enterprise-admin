package com.enterprise.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.PageResult;
import com.enterprise.dto.ConfigDTO;
import com.enterprise.dto.ConfigQueryDTO;
import com.enterprise.entity.Config;
import com.enterprise.mapper.ConfigMapper;
import com.enterprise.service.ConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 参数配置服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ConfigServiceImpl implements ConfigService {

    private final ConfigMapper configMapper;

    // 应用内缓存：key -> configValue
    private final Map<String, String> configCache = new ConcurrentHashMap<>();

    @Override
    public PageResult<Config> list(ConfigQueryDTO query, Integer current, Integer size) {
        Page<Config> page = new Page<>(current, size);
        LambdaQueryWrapper<Config> wrapper = new LambdaQueryWrapper<>();

        // 动态构建查询条件
        wrapper.like(StringUtils.hasText(query.getConfigName()), Config::getConfigName, query.getConfigName());
        wrapper.like(StringUtils.hasText(query.getConfigKey()), Config::getConfigKey, query.getConfigKey());
        wrapper.eq(StringUtils.hasText(query.getConfigType()), Config::getConfigType, query.getConfigType());
        wrapper.eq(query.getStatus() != null, Config::getStatus, query.getStatus());
        wrapper.orderByDesc(Config::getCreateTime);

        return PageResult.from(configMapper.selectPage(page, wrapper));
    }

    @Override
    public Config getById(Long configId) {
        return configMapper.selectById(configId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void add(ConfigDTO dto) {
        // 检查参数键是否已存在
        LambdaQueryWrapper<Config> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Config::getConfigKey, dto.getConfigKey());
        if (configMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("参数键已存在");
        }

        Config config = new Config();
        config.setConfigName(dto.getConfigName());
        config.setConfigKey(dto.getConfigKey());
        config.setConfigValue(dto.getConfigValue());
        config.setConfigType(dto.getConfigType());
        config.setDescription(dto.getDescription());
        config.setIsEditable(dto.getIsEditable() != null ? dto.getIsEditable() : 1);
        config.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);

        configMapper.insert(config);

        // 更新缓存
        configCache.put(dto.getConfigKey(), dto.getConfigValue());
        log.info("参数配置已添加：{} = {}", dto.getConfigKey(), dto.getConfigValue());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(ConfigDTO dto) {
        Config existing = configMapper.selectById(dto.getConfigId());
        if (existing == null) {
            throw new RuntimeException("参数配置不存在");
        }

        // 检查是否可编辑
        if (existing.getIsEditable() == 0) {
            throw new RuntimeException("该参数不可编辑");
        }

        // 检查参数键是否与其他记录重复
        LambdaQueryWrapper<Config> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Config::getConfigKey, dto.getConfigKey())
               .ne(Config::getConfigId, dto.getConfigId());
        if (configMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("参数键已存在");
        }

        existing.setConfigName(dto.getConfigName());
        existing.setConfigKey(dto.getConfigKey());
        existing.setConfigValue(dto.getConfigValue());
        existing.setConfigType(dto.getConfigType());
        existing.setDescription(dto.getDescription());
        existing.setIsEditable(dto.getIsEditable());
        existing.setStatus(dto.getStatus());

        configMapper.updateById(existing);

        // 更新缓存
        configCache.put(dto.getConfigKey(), dto.getConfigValue());
        log.info("参数配置已更新：{} = {}", dto.getConfigKey(), dto.getConfigValue());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long configId) {
        Config config = configMapper.selectById(configId);
        if (config == null) {
            throw new RuntimeException("参数配置不存在");
        }

        configMapper.deleteById(configId);

        // 清除缓存
        configCache.remove(config.getConfigKey());
        log.info("参数配置已删除：{}", config.getConfigKey());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDelete(List<Long> ids) {
        for (Long id : ids) {
            Config config = configMapper.selectById(id);
            if (config != null) {
                configMapper.deleteById(id);
                configCache.remove(config.getConfigKey());
            }
        }
        log.info("批量删除参数配置完成，删除数量：{}", ids.size());
    }

    @Override
    public String getValueByKey(String configKey) {
        // 先查缓存
        String value = configCache.get(configKey);
        if (value != null) {
            return value;
        }

        // 缓存未命中，查数据库
        LambdaQueryWrapper<Config> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Config::getConfigKey, configKey);
        Config config = configMapper.selectOne(wrapper);

        if (config == null) {
            throw new RuntimeException("参数配置不存在：" + configKey);
        }

        // 更新缓存
        configCache.put(configKey, config.getConfigValue());
        return config.getConfigValue();
    }

    @Override
    public void refreshCache() {
        // 清空缓存
        configCache.clear();

        // 重新加载所有启用的配置
        LambdaQueryWrapper<Config> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Config::getStatus, 1);
        List<Config> configs = configMapper.selectList(wrapper);

        for (Config config : configs) {
            configCache.put(config.getConfigKey(), config.getConfigValue());
        }

        log.info("参数配置缓存已刷新，加载数量：{}", configs.size());
    }
}
