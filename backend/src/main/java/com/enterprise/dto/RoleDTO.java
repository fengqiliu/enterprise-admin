package com.enterprise.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.util.List;

/**
 * 角色数据传输对象
 */
@Data
public class RoleDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long roleId;

    @NotBlank(message = "角色名称不能为空")
    @Size(max = 50, message = "角色名称不能超过 50 字符")
    private String roleName;

    @NotBlank(message = "角色编码不能为空")
    @Size(max = 50, message = "角色编码不能超过 50 字符")
    private String roleCode;

    @Size(max = 255, message = "描述不能超过 255 字符")
    private String description;

    /** 状态 0-禁用 1-启用 */
    private Integer status;

    /** 菜单 ID 列表（分配权限时使用） */
    private List<Long> menuIds;
}
