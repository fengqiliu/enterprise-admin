package com.enterprise.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 字典项实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_dict_item")
public class DictItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "item_id", type = IdType.ASSIGN_ID)
    private Long itemId;

    private Long dictId;

    private String itemLabel;

    private String itemValue;

    private Integer sortOrder;

    /** 状态 0-禁用 1-启用 */
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
