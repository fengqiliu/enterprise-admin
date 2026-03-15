package com.enterprise.service;

import com.enterprise.common.PageResult;
import com.enterprise.entity.OperationLog;

import java.util.List;

/**
 * 操作日志服务接口
 */
public interface OperationLogService {

    PageResult<OperationLog> list(String username, String operation, Integer status, Integer current, Integer size);

    void save(OperationLog log);

    void delete(List<Long> logIds);

    void deleteAll();
}
