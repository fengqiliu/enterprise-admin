package com.enterprise.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 字典实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_dict")
public class Dict implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "dict_id", type = IdType.ASSIGN_ID)
    private Long dictId;

    private String dictName;

    private String dictType;

    private String remark;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
