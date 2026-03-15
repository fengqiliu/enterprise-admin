package com.enterprise.controller;

import com.enterprise.common.Result;
import com.enterprise.dto.DepartmentDTO;
import com.enterprise.entity.Department;
import com.enterprise.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 部门管理控制器
 */
@Tag(name = "部门管理", description = "部门增删改查接口")
@RestController
@RequestMapping("/system/department")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping("/tree")
    @Operation(summary = "获取部门树")
    @PreAuthorize("hasAuthority('system:dept:list')")
    public Result<List<Department>> tree(
            @RequestParam(required = false) String deptName,
            @RequestParam(required = false) Integer status) {
        return Result.success(departmentService.listTree(deptName, status));
    }

    @GetMapping("/all")
    @Operation(summary = "获取所有部门树（用于下拉选择）")
    public Result<List<Department>> listAll() {
        return Result.success(departmentService.listAll());
    }

    @GetMapping("/{deptId}")
    @Operation(summary = "获取部门详情")
    @PreAuthorize("hasAuthority('system:dept:query')")
    public Result<Department> getById(@PathVariable Long deptId) {
        return Result.success(departmentService.getById(deptId));
    }

    @PostMapping
    @Operation(summary = "新增部门")
    @PreAuthorize("hasAuthority('system:dept:add')")
    public Result<Void> add(@Valid @RequestBody DepartmentDTO dto) {
        departmentService.add(dto);
        return Result.success();
    }

    @PutMapping
    @Operation(summary = "修改部门")
    @PreAuthorize("hasAuthority('system:dept:edit')")
    public Result<Void> update(@Valid @RequestBody DepartmentDTO dto) {
        departmentService.update(dto);
        return Result.success();
    }

    @DeleteMapping("/{deptId}")
    @Operation(summary = "删除部门")
    @PreAuthorize("hasAuthority('system:dept:delete')")
    public Result<Void> delete(@PathVariable Long deptId) {
        departmentService.delete(deptId);
        return Result.success();
    }
}
