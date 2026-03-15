package com.enterprise.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

/**
 * 字典数据传输对象
 */
@Data
public class DictDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long dictId;

    @NotBlank(message = "字典名称不能为空")
    @Size(max = 50, message = "字典名称不能超过 50 字符")
    private String dictName;

    @NotBlank(message = "字典类型不能为空")
    @Size(max = 50, message = "字典类型不能超过 50 字符")
    private String dictType;

    private String remark;
}
