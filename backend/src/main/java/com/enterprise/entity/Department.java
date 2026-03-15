package com.enterprise.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 部门实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_department")
public class Department implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "dept_id", type = IdType.ASSIGN_ID)
    private Long deptId;

    /** 父部门 ID，0 表示顶级 */
    private Long parentId;

    private String deptName;

    private Integer sortOrder;

    /** 状态 0-禁用 1-启用 */
    private Integer status;

    /** 子部门（非数据库字段） */
    @TableField(exist = false)
    private List<Department> children;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
