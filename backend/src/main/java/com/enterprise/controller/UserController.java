package com.enterprise.controller;

import com.enterprise.common.PageResult;
import com.enterprise.common.Result;
import com.enterprise.dto.UserDTO;
import com.enterprise.entity.User;
import com.enterprise.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户管理控制器
 */
@Tag(name = "用户管理", description = "用户增删改查等管理接口")
@RestController
@RequestMapping("/system/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/list")
    @Operation(summary = "获取用户列表")
    @PreAuthorize("hasAuthority('system:user:list')")
    public Result<PageResult<User>> list(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size) {
        PageResult<User> page = userService.list(username, nickname, status, current, size);
        return Result.success(page);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "获取用户详情")
    @PreAuthorize("hasAuthority('system:user:query')")
    public Result<User> getById(@PathVariable Long userId) {
        User user = userService.getById(userId);
        return Result.success(user);
    }

    @PostMapping
    @Operation(summary = "新增用户")
    @PreAuthorize("hasAuthority('system:user:add')")
    public Result<Void> add(@Valid @RequestBody UserDTO dto) {
        userService.add(dto);
        return Result.success();
    }

    @PutMapping
    @Operation(summary = "修改用户")
    @PreAuthorize("hasAuthority('system:user:edit')")
    public Result<Void> update(@Valid @RequestBody UserDTO dto) {
        userService.update(dto);
        return Result.success();
    }

    @DeleteMapping("/{userIds}")
    @Operation(summary = "删除用户")
    @PreAuthorize("hasAuthority('system:user:delete')")
    public Result<Void> delete(@PathVariable List<Long> userIds) {
        userService.delete(userIds);
        return Result.success();
    }

    @PutMapping("/{userId}/status")
    @Operation(summary = "修改用户状态")
    @PreAuthorize("hasAuthority('system:user:edit')")
    public Result<Void> updateStatus(@PathVariable Long userId, @RequestParam Integer status) {
        userService.updateStatus(userId, status);
        return Result.success();
    }

    @PutMapping("/{userId}/password")
    @Operation(summary = "重置密码")
    @PreAuthorize("hasAuthority('system:user:edit')")
    public Result<Void> resetPassword(@PathVariable Long userId, @RequestParam String password) {
        userService.resetPassword(userId, password);
        return Result.success();
    }
}