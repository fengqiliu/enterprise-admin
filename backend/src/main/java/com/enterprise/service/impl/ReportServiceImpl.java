package com.enterprise.service.impl;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.Result;
import com.enterprise.dto.ReportDTO;
import com.enterprise.dto.ReportResponse;
import com.enterprise.entity.Report;
import com.enterprise.mapper.ReportMapper;
import com.enterprise.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * 报表服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportMapper reportMapper;

    // 报表类型映射
    private static final Map<String, String> REPORT_TYPE_MAP = new LinkedHashMap<>();
    static {
        REPORT_TYPE_MAP.put("sales", "销售报表");
        REPORT_TYPE_MAP.put("finance", "财务报表");
        REPORT_TYPE_MAP.put("user", "用户分析");
        REPORT_TYPE_MAP.put("performance", "绩效报表");
        REPORT_TYPE_MAP.put("inventory", "库存报表");
    }

    // 状态映射
    private static final Map<Integer, String> STATUS_MAP = new HashMap<>();
    static {
        STATUS_MAP.put(0, "待生成");
        STATUS_MAP.put(1, "生成中");
        STATUS_MAP.put(2, "已完成");
        STATUS_MAP.put(3, "失败");
    }

    @Override
    public Page<ReportResponse> pageReports(int current, int size, ReportDTO query) {
        Page<Report> page = new Page<>(current, size);

        LambdaQueryWrapper<Report> wrapper = new LambdaQueryWrapper<>();
        if (StrUtil.isNotBlank(query.getReportType())) {
            wrapper.eq(Report::getReportType, query.getReportType());
        }
        if (StrUtil.isNotBlank(query.getStartDate())) {
            wrapper.ge(Report::getCreateTime, query.getStartDate());
        }
        if (StrUtil.isNotBlank(query.getEndDate())) {
            wrapper.le(Report::getCreateTime, query.getEndDate());
        }
        wrapper.orderByDesc(Report::getCreateTime);

        Page<Report> resultPage = reportMapper.selectPage(page, wrapper);

        // 转换为 ReportResponse
        List<ReportResponse> responses = resultPage.getRecords().stream()
                .map(this::convertToResponse)
                .toList();

        Page<ReportResponse> responsePage = new Page<>(current, size);
        responsePage.setRecords(responses);
        responsePage.setTotal(resultPage.getTotal());
        responsePage.setPages(resultPage.getPages());

        return responsePage;
    }

    @Override
    public ReportResponse getById(Long reportId) {
        Report report = reportMapper.selectById(reportId);
        if (report == null) {
            throw new RuntimeException("报表不存在");
        }
        return convertToResponse(report);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ReportResponse generate(ReportDTO reportDTO) {
        // 创建报表记录
        Report report = new Report();
        report.setReportId(IdUtil.getSnowflakeNextId());
        report.setReportName(reportDTO.getReportName());
        report.setReportType(reportDTO.getReportType());
        report.setDescription(reportDTO.getDescription());
        report.setStartDate(reportDTO.getStartDate());
        report.setEndDate(reportDTO.getEndDate());
        report.setParams(reportDTO.getParams());
        report.setStatus(1); // 生成中
        report.setDownloadCount(0);
        report.setCreateBy(1L); // TODO: 从当前登录用户获取
        report.setCreateByName("管理员"); // TODO: 从当前登录用户获取
        report.setRemark(reportDTO.getRemark());

        reportMapper.insert(report);

        // 异步生成报表（实际项目中应该使用异步任务）
        try {
            generateReportAsync(report);
        } catch (Exception e) {
            log.error("生成报表失败：{}", report.getReportId(), e);
            report.setStatus(3); // 失败
            reportMapper.updateById(report);
            throw new RuntimeException("生成报表失败：" + e.getMessage());
        }

        return convertToResponse(report);
    }

    /**
     * 异步生成报表
     */
    private void generateReportAsync(Report report) {
        try {
            // 模拟报表生成过程
            Thread.sleep(2000);

            // 创建报表文件目录
            String uploadDir = System.getProperty("user.dir") + "/backend/data/reports/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // 生成文件名
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String fileName = report.getReportType() + "_" + timestamp + ".csv";
            String filePath = uploadDir + fileName;

            // 生成 CSV 文件（实际项目中应该根据报表类型生成不同的内容）
            String csvContent = generateCsvContent(report);

            try (FileOutputStream fos = new FileOutputStream(filePath)) {
                fos.write(csvContent.getBytes("UTF-8"));
            }

            // 更新报表记录
            File file = new File(filePath);
            report.setFilePath("/api/reports/download/" + report.getReportId());
            report.setFileSize(file.length());
            report.setStatus(2); // 已完成
            reportMapper.updateById(report);

            log.info("报表生成成功：{}", report.getReportId());

        } catch (Exception e) {
            log.error("生成报表失败：{}", report.getReportId(), e);
            report.setStatus(3); // 失败
            reportMapper.updateById(report);
        }
    }

    /**
     * 生成 CSV 内容
     */
    private String generateCsvContent(Report report) {
        StringBuilder sb = new StringBuilder();

        // 根据报表类型生成不同的内容
        switch (report.getReportType()) {
            case "sales":
                sb.append("日期，产品名称，销售数量，销售金额，利润\n");
                sb.append("2024-01-01，电子产品，100，50000,15000\n");
                sb.append("2024-01-02，服装，200，30000,9000\n");
                sb.append("2024-01-03，家居用品，150，22500,6750\n");
                break;
            case "finance":
                sb.append("日期，收入，支出，利润，备注\n");
                sb.append("2024-01-01，100000,60000,40000，正常经营\n");
                sb.append("2024-01-02，120000,55000,65000，促销活动\n");
                sb.append("2024-01-03，90000,58000,32000，周末\n");
                break;
            case "user":
                sb.append("日期，新增用户，活跃用户，留存率\n");
                sb.append("2024-01-01，500，2000，85%\n");
                sb.append("2024-01-02，620，2100，82%\n");
                sb.append("2024-01-03，480，1950，88%\n");
                break;
            case "performance":
                sb.append("部门，业绩目标，实际业绩，完成率，排名\n");
                sb.append("销售部，1000000,1200000，120%,1\n");
                sb.append("技术部，800000,850000，106%,2\n");
                sb.append("市场部，600000,580000，97%,3\n");
                break;
            case "inventory":
                sb.append("产品类别，库存数量，库存金额，周转天数\n");
                sb.append("电子产品，500，2500000,30\n");
                sb.append("服装，1000，800000,45\n");
                sb.append("家居用品，800，600000,35\n");
                break;
            default:
                sb.append("报表数据\n");
                sb.append("数据 1，数据 2，数据 3\n");
        }

        return sb.toString();
    }

    @Override
    public byte[] download(Long reportId) {
        Report report = reportMapper.selectById(reportId);
        if (report == null) {
            throw new RuntimeException("报表不存在");
        }
        if (report.getStatus() != 2) {
            throw new RuntimeException("报表尚未生成完成");
        }

        // 增加下载次数
        report.setDownloadCount(report.getDownloadCount() + 1);
        reportMapper.updateById(report);

        // 读取文件内容
        try {
            String filePath = System.getProperty("user.dir") + "/backend/data/reports/";
            File dir = new File(filePath);
            File[] files = dir.listFiles(f -> f.getName().startsWith(report.getReportType()));
            if (files != null && files.length > 0) {
                return Files.readAllBytes(files[0].toPath());
            }
            throw new RuntimeException("报表文件不存在");
        } catch (IOException e) {
            throw new RuntimeException("下载报表失败：" + e.getMessage());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long reportId) {
        Report report = reportMapper.selectById(reportId);
        if (report == null) {
            throw new RuntimeException("报表不存在");
        }

        // 删除文件
        if (StrUtil.isNotBlank(report.getFilePath())) {
            try {
                String filePath = System.getProperty("user.dir") + "/backend/data/reports/";
                File dir = new File(filePath);
                File[] files = dir.listFiles(f -> f.getName().startsWith(report.getReportType()));
                if (files != null && files.length > 0) {
                    files[0].delete();
                }
            } catch (Exception e) {
                log.error("删除报表文件失败：{}", reportId, e);
            }
        }

        // 删除记录
        reportMapper.deleteById(reportId);
    }

    @Override
    public List<Map<String, String>> getReportTypes() {
        List<Map<String, String>> result = new ArrayList<>();
        for (Map.Entry<String, String> entry : REPORT_TYPE_MAP.entrySet()) {
            Map<String, String> item = new HashMap<>();
            item.put("value", entry.getKey());
            item.put("label", entry.getValue());
            result.add(item);
        }
        return result;
    }

    /**
     * 转换为 ReportResponse
     */
    private ReportResponse convertToResponse(Report report) {
        ReportResponse response = new ReportResponse();
        response.setReportId(report.getReportId());
        response.setReportName(report.getReportName());
        response.setReportType(REPORT_TYPE_MAP.getOrDefault(report.getReportType(), report.getReportType()));
        response.setDescription(report.getDescription());
        response.setStartDate(report.getStartDate());
        response.setEndDate(report.getEndDate());
        response.setStatus(report.getStatus());
        response.setStatusDesc(STATUS_MAP.getOrDefault(report.getStatus(), "未知"));
        response.setDownloadCount(report.getDownloadCount());
        response.setFileSizeFormatted(formatFileSize(report.getFileSize()));
        response.setCreateByName(report.getCreateByName());
        response.setCreateTime(report.getCreateTime());
        response.setFilePath(report.getFilePath());
        return response;
    }

    /**
     * 格式化文件大小
     */
    private String formatFileSize(Long fileSize) {
        if (fileSize == null || fileSize == 0) {
            return "-";
        }
        if (fileSize < 1024) {
            return fileSize + " B";
        } else if (fileSize < 1024 * 1024) {
            return String.format("%.2f KB", fileSize / 1024.0);
        } else if (fileSize < 1024 * 1024 * 1024) {
            return String.format("%.2f MB", fileSize / (1024.0 * 1024.0));
        } else {
            return String.format("%.2f GB", fileSize / (1024.0 * 1024.0 * 1024.0));
        }
    }
}
