package com.enterprise.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT 配置类
 */
@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    /**
     * JWT 密钥
     */
    private String secret;

    /**
     * 过期时间（毫秒）默认 24 小时
     */
    private Long expiration = 86400000L;

    /**
     * Token 前缀
     */
    private String tokenPrefix = "Bearer ";

    /**
     * Token header 名称
     */
    private String header = "Authorization";
}