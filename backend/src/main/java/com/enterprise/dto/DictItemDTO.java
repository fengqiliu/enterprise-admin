package com.enterprise.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * 字典项数据传输对象
 */
@Data
public class DictItemDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long itemId;

    @NotNull(message = "字典 ID 不能为空")
    private Long dictId;

    @NotBlank(message = "字典标签不能为空")
    private String itemLabel;

    @NotBlank(message = "字典值不能为空")
    private String itemValue;

    private Integer sortOrder;

    /** 状态 0-禁用 1-启用 */
    private Integer status;
}
