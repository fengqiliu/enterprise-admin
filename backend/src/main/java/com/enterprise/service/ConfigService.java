package com.enterprise.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.PageResult;
import com.enterprise.dto.ConfigDTO;
import com.enterprise.dto.ConfigQueryDTO;
import com.enterprise.entity.Config;

import java.util.List;

/**
 * 参数配置服务接口
 */
public interface ConfigService {

    PageResult<Config> list(ConfigQueryDTO query, Integer current, Integer size);

    Config getById(Long configId);

    void add(ConfigDTO dto);

    void update(ConfigDTO dto);

    void delete(Long configId);

    void batchDelete(List<Long> ids);

    String getValueByKey(String configKey);

    void refreshCache();
}
