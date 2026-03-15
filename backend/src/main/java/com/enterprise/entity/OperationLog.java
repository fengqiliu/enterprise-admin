package com.enterprise.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 操作日志实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_operation_log")
public class OperationLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "log_id", type = IdType.ASSIGN_ID)
    private Long logId;

    private Long userId;

    private String username;

    private String operation;

    private String method;

    private String params;

    private String ip;

    /** 执行时长 (ms) */
    private Long time;

    /** 状态 0-失败 1-成功 */
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
