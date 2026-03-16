package com.enterprise.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

/**
 * 参数配置数据传输对象
 */
@Data
public class ConfigDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long configId;

    @NotBlank(message = "参数名称不能为空")
    @Size(max = 100, message = "参数名称不能超过 100 字符")
    private String configName;

    @NotBlank(message = "参数键不能为空")
    @Size(max = 50, message = "参数键不能超过 50 字符")
    private String configKey;

    @Size(max = 500, message = "参数值不能超过 500 字符")
    private String configValue;

    @Size(max = 50, message = "分组类型不能超过 50 字符")
    private String configType;

    private String description;

    private Integer isEditable;

    private Integer status;
}
