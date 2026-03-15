package com.enterprise.controller;

import com.enterprise.common.Result;
import com.enterprise.dto.GitHubLoginRequest;
import com.enterprise.dto.LoginRequest;
import com.enterprise.dto.LoginResponse;
import com.enterprise.dto.RegisterRequest;
import com.enterprise.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@Tag(name = "认证管理", description = "用户登录、登出、注册等认证相关接口")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return Result.success(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "用户登出")
    public Result<Void> logout() {
        authService.logout();
        return Result.success();
    }

    @PostMapping("/refresh")
    @Operation(summary = "刷新 Token")
    public Result<LoginResponse> refreshToken(@RequestHeader("Authorization") String token) {
        LoginResponse response = authService.refreshToken(token);
        return Result.success(response);
    }

    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public Result<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return Result.success(response);
    }

    @PostMapping("/github-login")
    @Operation(summary = "GitHub 登录")
    public Result<LoginResponse> githubLogin(@Valid @RequestBody GitHubLoginRequest request) {
        LoginResponse response = authService.githubLogin(request.getCode());
        return Result.success(response);
    }
}