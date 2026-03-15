package com.enterprise.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.PageResult;
import com.enterprise.entity.LoginLog;
import com.enterprise.mapper.LoginLogMapper;
import com.enterprise.service.LoginLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 登录日志服务实现类
 */
@Service
@RequiredArgsConstructor
public class LoginLogServiceImpl implements LoginLogService {

    private final LoginLogMapper loginLogMapper;

    @Override
    public PageResult<LoginLog> list(String username, String ip, Integer status, Integer current, Integer size) {
        Page<LoginLog> page = new Page<>(current, size);
        LambdaQueryWrapper<LoginLog> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(username != null && !username.isEmpty(), LoginLog::getUsername, username);
        wrapper.like(ip != null && !ip.isEmpty(), LoginLog::getIp, ip);
        wrapper.eq(status != null, LoginLog::getStatus, status);
        wrapper.orderByDesc(LoginLog::getCreateTime);
        return PageResult.from(loginLogMapper.selectPage(page, wrapper));
    }

    @Override
    public void save(LoginLog log) {
        loginLogMapper.insert(log);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(List<Long> logIds) {
        for (Long logId : logIds) {
            loginLogMapper.deleteById(logId);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteAll() {
        loginLogMapper.delete(new LambdaQueryWrapper<>());
    }
}
