package com.enterprise.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.PageResult;
import com.enterprise.common.Result;
import com.enterprise.dto.ConfigDTO;
import com.enterprise.dto.ConfigQueryDTO;
import com.enterprise.entity.Config;
import com.enterprise.service.ConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系统参数配置控制器
 */
@Tag(name = "系统参数配置", description = "系统参数管理接口")
@RestController
@RequestMapping("/business/config")
@RequiredArgsConstructor
public class ConfigController {

    private final ConfigService configService;

    @GetMapping("/list")
    @Operation(summary = "分页查询参数列表")
    @PreAuthorize("hasAuthority('business:config:list')")
    public Result<PageResult<Config>> list(ConfigQueryDTO query,
                                           @RequestParam(defaultValue = "1") Integer current,
                                           @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(configService.list(query, current, size));
    }

    @GetMapping("/{configId}")
    @Operation(summary = "获取参数详情")
    @PreAuthorize("hasAuthority('business:config:query')")
    public Result<Config> getById(@PathVariable Long configId) {
        return Result.success(configService.getById(configId));
    }

    @PostMapping
    @Operation(summary = "新增参数")
    @PreAuthorize("hasAuthority('business:config:add')")
    public Result<Void> add(@Valid @RequestBody ConfigDTO dto) {
        configService.add(dto);
        return Result.success();
    }

    @PutMapping
    @Operation(summary = "修改参数")
    @PreAuthorize("hasAuthority('business:config:edit')")
    public Result<Void> update(@Valid @RequestBody ConfigDTO dto) {
        configService.update(dto);
        return Result.success();
    }

    @DeleteMapping("/{configId}")
    @Operation(summary = "删除参数")
    @PreAuthorize("hasAuthority('business:config:delete')")
    public Result<Void> delete(@PathVariable Long configId) {
        configService.delete(configId);
        return Result.success();
    }

    @DeleteMapping
    @Operation(summary = "批量删除参数")
    @PreAuthorize("hasAuthority('business:config:delete')")
    public Result<Void> batchDelete(@RequestParam List<Long> ids) {
        configService.batchDelete(ids);
        return Result.success();
    }

    @GetMapping("/value/{configKey}")
    @Operation(summary = "根据 key 获取参数值")
    public Result<String> getValueByKey(@PathVariable String configKey) {
        return Result.success(configService.getValueByKey(configKey));
    }

    @PostMapping("/refresh")
    @Operation(summary = "刷新参数缓存")
    @PreAuthorize("hasAuthority('business:config:edit')")
    public Result<Void> refreshCache() {
        configService.refreshCache();
        return Result.success();
    }
}
