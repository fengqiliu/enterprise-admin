package com.enterprise.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.dto.ReportDTO;
import com.enterprise.dto.ReportResponse;
import com.enterprise.entity.Report;

import java.util.List;
import java.util.Map;

/**
 * 报表服务接口
 */
public interface ReportService {

    /**
     * 分页查询报表列表
     */
    Page<ReportResponse> pageReports(int current, int size, ReportDTO query);

    /**
     * 根据 ID 查询报表
     */
    ReportResponse getById(Long reportId);

    /**
     * 生成报表
     */
    ReportResponse generate(ReportDTO reportDTO);

    /**
     * 下载报表
     */
    byte[] download(Long reportId);

    /**
     * 删除报表
     */
    void delete(Long reportId);

    /**
     * 获取报表类型字典
     */
    List<Map<String, String>> getReportTypes();
}
