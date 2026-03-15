package com.enterprise.service.impl;

import com.enterprise.config.JwtConfig;
import com.enterprise.dto.LoginRequest;
import com.enterprise.dto.LoginResponse;
import com.enterprise.dto.LoginResponse.UserInfo;
import com.enterprise.entity.Role;
import com.enterprise.entity.User;
import com.enterprise.mapper.MenuMapper;
import com.enterprise.mapper.RoleMapper;
import com.enterprise.mapper.UserMapper;
import com.enterprise.service.AuthService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 认证服务实现类
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final MenuMapper menuMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtConfig jwtConfig;
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public LoginResponse login(LoginRequest request) {
        // 查询用户
        User user = userMapper.selectByUsername(request.getUsername());
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 检查用户状态
        if (user.getStatus() == 0) {
            throw new RuntimeException("用户已被禁用");
        }

        // 获取用户角色
        List<Role> roles = roleMapper.selectRolesByUserId(user.getUserId());
        List<String> roleNames = roles.stream().map(Role::getRoleName).collect(Collectors.toList());

        // 获取用户权限（从菜单中读取）
        List<String> permissions = menuMapper.selectPermissionsByUserId(user.getUserId());

        // 生成 Token（将权限存入 JWT）
        String token = generateToken(user, permissions);

        // 构建用户信息
        UserInfo userInfo = new UserInfo(
                user.getUserId(),
                user.getUsername(),
                user.getNickname(),
                user.getAvatar(),
                user.getEmail(),
                user.getPhone(),
                roleNames,
                permissions
        );

        // 将 Token 存入 Redis
        String redisKey = "token:" + user.getUserId();
        redisTemplate.opsForValue().set(redisKey, token, jwtConfig.getExpiration(), TimeUnit.MILLISECONDS);

        return new LoginResponse(token, "Bearer", jwtConfig.getExpiration(), userInfo);
    }

    @Override
    public void logout() {
        // 实际项目中从 SecurityContext 获取 userId 并删除 Redis key
    }

    @Override
    public LoginResponse refreshToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Long userId = validateToken(token);
        if (userId == null) {
            throw new RuntimeException("Token 已过期");
        }

        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        List<Role> roles = roleMapper.selectRolesByUserId(userId);
        List<String> roleNames = roles.stream().map(Role::getRoleName).collect(Collectors.toList());
        List<String> permissions = menuMapper.selectPermissionsByUserId(userId);

        String newToken = generateToken(user, permissions);
        UserInfo userInfo = new UserInfo(
                user.getUserId(), user.getUsername(), user.getNickname(),
                user.getAvatar(), user.getEmail(), user.getPhone(),
                roleNames, permissions
        );

        String redisKey = "token:" + user.getUserId();
        redisTemplate.opsForValue().set(redisKey, newToken, jwtConfig.getExpiration(), TimeUnit.MILLISECONDS);

        return new LoginResponse(newToken, "Bearer", jwtConfig.getExpiration(), userInfo);
    }

    /**
     * 生成 JWT Token（将权限列表存入 claims）
     */
    private String generateToken(User user, List<String> permissions) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + jwtConfig.getExpiration());

        SecretKey key = Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8));

        // 将权限列表用逗号连接存入 JWT
        String permissionsStr = String.join(",", permissions);

        return Jwts.builder()
                .subject(String.valueOf(user.getUserId()))
                .claim("username", user.getUsername())
                .claim("permissions", permissionsStr)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }

    private Long validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8));
            var claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Long.parseLong(claims.getSubject());
        } catch (Exception e) {
            return null;
        }
    }
}
