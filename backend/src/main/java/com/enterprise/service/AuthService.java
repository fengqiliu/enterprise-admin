package com.enterprise.service;

import com.enterprise.dto.LoginRequest;
import com.enterprise.dto.LoginResponse;
import com.enterprise.dto.RegisterRequest;

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

    /**
     * 用户注册
     * @param request 注册请求
     * @return 登录响应
     */
    LoginResponse register(RegisterRequest request);

    /**
     * GitHub 登录
     * @param code OAuth 授权码
     * @return 登录响应
     */
    LoginResponse githubLogin(String code);
}