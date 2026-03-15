package com.enterprise.service;

import com.enterprise.common.PageResult;
import com.enterprise.entity.LoginLog;

import java.util.List;

/**
 * 登录日志服务接口
 */
public interface LoginLogService {

    PageResult<LoginLog> list(String username, String ip, Integer status, Integer current, Integer size);

    void save(LoginLog log);

    void delete(List<Long> logIds);

    void deleteAll();
}
