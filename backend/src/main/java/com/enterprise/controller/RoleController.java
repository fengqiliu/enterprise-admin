package com.enterprise.controller;

import com.enterprise.common.PageResult;
import com.enterprise.common.Result;
import com.enterprise.dto.RoleDTO;
import com.enterprise.entity.Role;
import com.enterprise.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 角色管理控制器
 */
@Tag(name = "角色管理", description = "角色增删改查及权限分配接口")
@RestController
@RequestMapping("/system/role")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping("/list")
    @Operation(summary = "获取角色列表（分页）")
    @PreAuthorize("hasAuthority('system:role:list')")
    public Result<PageResult<Role>> list(
            @RequestParam(required = false) String roleName,
            @RequestParam(required = false) String roleCode,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(roleService.list(roleName, roleCode, status, current, size));
    }

    @GetMapping("/all")
    @Operation(summary = "获取所有启用角色（下拉用）")
    public Result<List<Role>> listAll() {
        return Result.success(roleService.listAll());
    }

    @GetMapping("/{roleId}")
    @Operation(summary = "获取角色详情")
    @PreAuthorize("hasAuthority('system:role:query')")
    public Result<Role> getById(@PathVariable Long roleId) {
        return Result.success(roleService.getById(roleId));
    }

    @PostMapping
    @Operation(summary = "新增角色")
    @PreAuthorize("hasAuthority('system:role:add')")
    public Result<Void> add(@Valid @RequestBody RoleDTO dto) {
        roleService.add(dto);
        return Result.success();
    }

    @PutMapping
    @Operation(summary = "修改角色")
    @PreAuthorize("hasAuthority('system:role:edit')")
    public Result<Void> update(@Valid @RequestBody RoleDTO dto) {
        roleService.update(dto);
        return Result.success();
    }

    @DeleteMapping("/{roleIds}")
    @Operation(summary = "删除角色")
    @PreAuthorize("hasAuthority('system:role:delete')")
    public Result<Void> delete(@PathVariable List<Long> roleIds) {
        roleService.delete(roleIds);
        return Result.success();
    }

    @PutMapping("/{roleId}/status")
    @Operation(summary = "修改角色状态")
    @PreAuthorize("hasAuthority('system:role:edit')")
    public Result<Void> updateStatus(@PathVariable Long roleId, @RequestParam Integer status) {
        roleService.updateStatus(roleId, status);
        return Result.success();
    }

    @PutMapping("/{roleId}/menus")
    @Operation(summary = "分配菜单权限")
    @PreAuthorize("hasAuthority('system:role:edit')")
    public Result<Void> assignMenus(@PathVariable Long roleId, @RequestBody List<Long> menuIds) {
        roleService.assignMenus(roleId, menuIds);
        return Result.success();
    }
}
