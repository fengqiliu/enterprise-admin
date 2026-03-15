package com.enterprise.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

/**
 * 菜单数据传输对象
 */
@Data
public class MenuDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long menuId;

    /** 父菜单 ID，0 表示顶级 */
    private Long parentId;

    @NotBlank(message = "菜单名称不能为空")
    @Size(max = 50, message = "菜单名称不能超过 50 字符")
    private String menuName;

    /** 菜单类型 1-目录 2-菜单 3-按钮 */
    @NotNull(message = "菜单类型不能为空")
    private Integer menuType;

    private String path;

    private String component;

    private String permission;

    private String icon;

    private Integer sortOrder;

    /** 状态 0-禁用 1-启用 */
    private Integer status;
}
