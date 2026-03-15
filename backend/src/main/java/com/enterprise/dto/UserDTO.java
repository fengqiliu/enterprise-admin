package com.enterprise.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.util.List;

/**
 * 用户数据传输对象
 */
@Data
public class UserDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户 ID（更新时使用）
     */
    private Long userId;

    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名长度必须在 2-20 之间")
    private String username;

    /**
     * 密码（新增时使用）
     */
    @Size(min = 6, max = 20, message = "密码长度必须在 6-20 之间")
    private String password;

    /**
     * 昵称
     */
    @NotBlank(message = "昵称不能为空")
    @Size(max = 20, message = "昵称长度不能超过 20")
    private String nickname;

    /**
     * 邮箱
     */
    @Email(message = "邮箱格式不正确")
    private String email;

    /**
     * 手机号
     */
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 性别 0-女 1-男 2-未知
     */
    private Integer gender;

    /**
     * 状态 0-禁用 1-启用
     */
    private Integer status;

    /**
     * 部门 ID
     */
    private Long deptId;

    /**
     * 角色 ID 列表
     */
    private List<Long> roleIds;
}