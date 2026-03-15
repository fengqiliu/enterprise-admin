package com.enterprise.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

/**
 * 部门数据传输对象
 */
@Data
public class DepartmentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long deptId;

    /** 父部门 ID，0 表示顶级 */
    private Long parentId;

    @NotBlank(message = "部门名称不能为空")
    @Size(max = 50, message = "部门名称不能超过 50 字符")
    private String deptName;

    private Integer sortOrder;

    /** 状态 0-禁用 1-启用 */
    private Integer status;
}
