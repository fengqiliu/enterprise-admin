package com.enterprise.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 报表实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_report")
public class Report implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 报表 ID
     */
    @TableId(value = "report_id", type = IdType.ASSIGN_ID)
    private Long reportId;

    /**
     * 报表名称
     */
    private String reportName;

    /**
     * 报表类型：sales-销售报表，finance-财务报表，user-用户分析，performance-绩效报表，inventory-库存报表
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
     * 报表参数（JSON 格式）
     */
    private String params;

    /**
     * 文件路径
     */
    private String filePath;

    /**
     * 文件大小（字节）
     */
    private Long fileSize;

    /**
     * 状态：0-待生成 1-生成中 2-已完成 3-失败
     */
    private Integer status;

    /**
     * 下载次数
     */
    private Integer downloadCount;

    /**
     * 创建人 ID
     */
    private Long createBy;

    /**
     * 创建人姓名
     */
    private String createByName;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 备注
     */
    private String remark;
}
