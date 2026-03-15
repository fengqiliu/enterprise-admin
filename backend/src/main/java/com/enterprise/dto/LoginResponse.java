package com.enterprise.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * 登录响应 DTO
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 访问令牌
     */
    private String token;

    /**
     * 令牌类型
     */
    private String tokenType = "Bearer";

    /**
     * 过期时间（毫秒）
     */
    private Long expiresIn;

    /**
     * 用户信息
     */
    private UserInfo userInfo;

    /**
     * 用户信息内部类
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserInfo implements Serializable {
        /**
         * 用户 ID
         */
        private Long userId;

        /**
         * 用户名
         */
        private String username;

        /**
         * 昵称
         */
        private String nickname;

        /**
         * 头像
         */
        private String avatar;

        /**
         * 邮箱
         */
        private String email;

        /**
         * 手机号
         */
        private String phone;

        /**
         * 角色列表
         */
        private List<String> roles;

        /**
         * 权限列表
         */
        private List<String> permissions;
    }
}