package com.enterprise.dto;

import lombok.Data;

/**
 * GitHub 登录请求 DTO
 */
@Data
public class GitHubLoginRequest {

    /**
     * GitHub OAuth 授权码
     */
    private String code;

    /**
     * 重定向 URI
     */
    private String redirectUri;
}
