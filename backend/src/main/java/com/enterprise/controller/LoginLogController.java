package com.enterprise.controller;

import com.enterprise.common.PageResult;
import com.enterprise.common.Result;
import com.enterprise.entity.LoginLog;
import com.enterprise.service.LoginLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 登录日志控制器
 */
@Tag(name = "登录日志", description = "系统登录日志查询接口")
@RestController
@RequestMapping("/log/login")
@RequiredArgsConstructor
public class LoginLogController {

    private final LoginLogService loginLogService;

    @GetMapping("/list")
    @Operation(summary = "分页获取登录日志列表")
    @PreAuthorize("hasAuthority('log:login:list')")
    public Result<PageResult<LoginLog>> list(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String ip,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(loginLogService.list(username, ip, status, current, size));
    }

    @DeleteMapping("/{logIds}")
    @Operation(summary = "删除登录日志")
    @PreAuthorize("hasAuthority('log:login:list')")
    public Result<Void> delete(@PathVariable List<Long> logIds) {
        loginLogService.delete(logIds);
        return Result.success();
    }

    @DeleteMapping("/clean")
    @Operation(summary = "清空登录日志")
    @PreAuthorize("hasAuthority('log:login:list')")
    public Result<Void> clean() {
        loginLogService.deleteAll();
        return Result.success();
    }
}
