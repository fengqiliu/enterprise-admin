package com.enterprise.controller;

import com.enterprise.common.PageResult;
import com.enterprise.common.Result;
import com.enterprise.entity.OperationLog;
import com.enterprise.service.OperationLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 操作日志控制器
 */
@Tag(name = "操作日志", description = "系统操作日志查询接口")
@RestController
@RequestMapping("/log/operation")
@RequiredArgsConstructor
public class OperationLogController {

    private final OperationLogService operationLogService;

    @GetMapping("/list")
    @Operation(summary = "分页获取操作日志列表")
    @PreAuthorize("hasAuthority('log:operation:list')")
    public Result<PageResult<OperationLog>> list(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String operation,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(operationLogService.list(username, operation, status, current, size));
    }

    @DeleteMapping("/{logIds}")
    @Operation(summary = "删除操作日志")
    @PreAuthorize("hasAuthority('log:operation:list')")
    public Result<Void> delete(@PathVariable List<Long> logIds) {
        operationLogService.delete(logIds);
        return Result.success();
    }

    @DeleteMapping("/clean")
    @Operation(summary = "清空操作日志")
    @PreAuthorize("hasAuthority('log:operation:list')")
    public Result<Void> clean() {
        operationLogService.deleteAll();
        return Result.success();
    }
}
