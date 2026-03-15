package com.enterprise.dto;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 报表响应对象
 */
@Data
public class ReportResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 报表 ID
     */
    private Long reportId;

    /**
     * 报表名称
     */
    private String reportName;

    /**
     * 报表类型
     */
    private String reportType;

    /**
     * 报表描述
     */
    private String description;

    /**
     * 开始日期
     */
    private String startDate;

    /**
     * 结束日期
     */
    private String endDate;

    /**
     * 状态：0-待生成 1-生成中 2-已完成 3-失败
     */
    private Integer status;

    /**
     * 状态描述
     */
    private String statusDesc;

    /**
     * 下载次数
     */
    private Integer downloadCount;

    /**
     * 文件大小（格式化后）
     */
    private String fileSizeFormatted;

    /**
     * 创建人姓名
     */
    private String createByName;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 文件路径
     */
    private String filePath;
}
