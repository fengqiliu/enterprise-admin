package com.enterprise.controller;

import com.enterprise.common.Result;
import com.enterprise.dto.MenuDTO;
import com.enterprise.entity.Menu;
import com.enterprise.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 菜单管理控制器
 */
@Tag(name = "菜单管理", description = "菜单增删改查接口")
@RestController
@RequestMapping("/system/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/tree")
    @Operation(summary = "获取菜单树")
    @PreAuthorize("hasAuthority('system:menu:list')")
    public Result<List<Menu>> tree(
            @RequestParam(required = false) String menuName,
            @RequestParam(required = false) Integer status) {
        return Result.success(menuService.listTree(menuName, status));
    }

    @GetMapping("/all")
    @Operation(summary = "获取所有菜单树（用于下拉选择）")
    public Result<List<Menu>> listAll() {
        return Result.success(menuService.listAll());
    }

    @GetMapping("/{menuId}")
    @Operation(summary = "获取菜单详情")
    @PreAuthorize("hasAuthority('system:menu:query')")
    public Result<Menu> getById(@PathVariable Long menuId) {
        return Result.success(menuService.getById(menuId));
    }

    @PostMapping
    @Operation(summary = "新增菜单")
    @PreAuthorize("hasAuthority('system:menu:add')")
    public Result<Void> add(@Valid @RequestBody MenuDTO dto) {
        menuService.add(dto);
        return Result.success();
    }

    @PutMapping
    @Operation(summary = "修改菜单")
    @PreAuthorize("hasAuthority('system:menu:edit')")
    public Result<Void> update(@Valid @RequestBody MenuDTO dto) {
        menuService.update(dto);
        return Result.success();
    }

    @DeleteMapping("/{menuId}")
    @Operation(summary = "删除菜单")
    @PreAuthorize("hasAuthority('system:menu:delete')")
    public Result<Void> delete(@PathVariable Long menuId) {
        menuService.delete(menuId);
        return Result.success();
    }
}
