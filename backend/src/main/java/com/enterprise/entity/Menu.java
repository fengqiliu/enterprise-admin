package com.enterprise.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 菜单实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_menu")
public class Menu implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "menu_id", type = IdType.ASSIGN_ID)
    private Long menuId;

    /** 父菜单 ID，0 表示顶级 */
    private Long parentId;

    private String menuName;

    /** 菜单类型 1-目录 2-菜单 3-按钮 */
    private Integer menuType;

    private String path;

    private String component;

    private String permission;

    private String icon;

    private Integer sortOrder;

    /** 状态 0-禁用 1-启用 */
    private Integer status;

    /** 子菜单（非数据库字段） */
    @TableField(exist = false)
    private List<Menu> children;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
