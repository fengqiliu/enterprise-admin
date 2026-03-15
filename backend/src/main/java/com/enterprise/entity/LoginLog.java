package com.enterprise.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 登录日志实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_login_log")
public class LoginLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "log_id", type = IdType.ASSIGN_ID)
    private Long logId;

    private Long userId;

    private String username;

    private String ip;

    private String location;

    private String browser;

    private String os;

    /** 状态 0-失败 1-成功 */
    private Integer status;

    private String message;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
