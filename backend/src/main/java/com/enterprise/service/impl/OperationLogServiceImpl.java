package com.enterprise.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.PageResult;
import com.enterprise.entity.OperationLog;
import com.enterprise.mapper.OperationLogMapper;
import com.enterprise.service.OperationLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 操作日志服务实现类
 */
@Service
@RequiredArgsConstructor
public class OperationLogServiceImpl implements OperationLogService {

    private final OperationLogMapper operationLogMapper;

    @Override
    public PageResult<OperationLog> list(String username, String operation, Integer status, Integer current, Integer size) {
        Page<OperationLog> page = new Page<>(current, size);
        LambdaQueryWrapper<OperationLog> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(username != null && !username.isEmpty(), OperationLog::getUsername, username);
        wrapper.like(operation != null && !operation.isEmpty(), OperationLog::getOperation, operation);
        wrapper.eq(status != null, OperationLog::getStatus, status);
        wrapper.orderByDesc(OperationLog::getCreateTime);
        return PageResult.from(operationLogMapper.selectPage(page, wrapper));
    }

    @Override
    public void save(OperationLog log) {
        operationLogMapper.insert(log);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(List<Long> logIds) {
        for (Long logId : logIds) {
            operationLogMapper.deleteById(logId);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteAll() {
        operationLogMapper.delete(new LambdaQueryWrapper<>());
    }
}
