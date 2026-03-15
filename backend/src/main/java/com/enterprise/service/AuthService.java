package com.enterprise.service;

import com.enterprise.dto.LoginRequest;
import com.enterprise.dto.LoginResponse;

/**
 * 认证服务接口
 */
public interface AuthService {

    /**
     * 用户登录
     * @param request 登录请求
     * @return 登录响应
     */
    LoginResponse login(LoginRequest request);

    /**
     * 用户登出
     */
    void logout();

    /**
     * 刷新 Token
     * @param token 原 Token
     * @return 新的登录响应
     */
    LoginResponse refreshToken(String token);
}