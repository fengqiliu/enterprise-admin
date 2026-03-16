package com.enterprise.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 参数配置查询数据传输对象
 */
@Data
public class ConfigQueryDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 按名称模糊查询
     */
    private String configName;

    /**
     * 按键模糊查询
     */
    private String configKey;

    /**
     * 按类型精确查询
     */
    private String configType;

    /**
     * 按状态筛选
     */
    private Integer status;
}
