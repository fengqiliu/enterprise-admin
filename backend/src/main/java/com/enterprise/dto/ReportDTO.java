package com.enterprise.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

/**
 * 报表数据传输对象
 */
@Data
public class ReportDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 报表 ID
     */
    private Long reportId;

    /**
     * 报表名称
     */
    @NotBlank(message = "报表名称不能为空")
    @Size(max = 100, message = "报表名称长度不能超过 100")
    private String reportName;

    /**
     * 报表类型
     */
    @NotBlank(message = "报表类型不能为空")
    private String reportType;

    /**
     * 报表描述
     */
    private String description;

    /**
     * 开始日期
     */
    @NotBlank(message = "开始日期不能为空")
    private String startDate;

    /**
     * 结束日期
     */
    @NotBlank(message = "结束日期不能为空")
    private String endDate;

    /**
     * 报表参数（JSON 格式）
     */
    private String params;

    /**
     * 备注
     */
    private String remark;
}
