package com.enterprise.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.Result;
import com.enterprise.dto.ReportDTO;
import com.enterprise.dto.ReportResponse;
import com.enterprise.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 报表控制器
 */
@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
@Tag(name = "报表管理", description = "报表生成、下载、删除等操作")
public class ReportController {

    private final ReportService reportService;

    /**
     * 分页查询报表列表
     */
    @GetMapping("/page")
    @Operation(summary = "分页查询报表列表")
    public Result<Page<ReportResponse>> pageReports(
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int size,
            ReportDTO query) {
        Page<ReportResponse> page = reportService.pageReports(current, size, query);
        return Result.success(page);
    }

    /**
     * 根据 ID 查询报表
     */
    @GetMapping("/{id}")
    @Operation(summary = "根据 ID 查询报表详情")
    public Result<ReportResponse> getById(@PathVariable Long id) {
        ReportResponse response = reportService.getById(id);
        return Result.success(response);
    }

    /**
     * 生成报表
     */
    @PostMapping("/generate")
    @Operation(summary = "生成报表")
    public Result<ReportResponse> generate(@Valid @RequestBody ReportDTO reportDTO) {
        ReportResponse response = reportService.generate(reportDTO);
        return Result.success("报表生成任务已提交", response);
    }

    /**
     * 下载报表
     */
    @GetMapping("/download/{id}")
    @Operation(summary = "下载报表文件")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        byte[] content = reportService.download(id);
        ReportResponse response = reportService.getById(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", response.getReportName() + ".csv");

        return new ResponseEntity<>(content, headers, HttpStatus.OK);
    }

    /**
     * 删除报表
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除报表")
    public Result<Void> delete(@PathVariable Long id) {
        reportService.delete(id);
        return Result.success();
    }

    /**
     * 获取报表类型字典
     */
    @GetMapping("/types")
    @Operation(summary = "获取报表类型字典")
    public Result<List<Map<String, String>>> getReportTypes() {
        List<Map<String, String>> types = reportService.getReportTypes();
        return Result.success(types);
    }
}
