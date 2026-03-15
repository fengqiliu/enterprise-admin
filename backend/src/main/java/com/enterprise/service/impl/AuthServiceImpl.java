package com.enterprise.service.impl;

import com.enterprise.config.JwtConfig;
import com.enterprise.dto.LoginRequest;
import com.enterprise.dto.LoginResponse;
import com.enterprise.dto.LoginResponse.UserInfo;
import com.enterprise.dto.RegisterRequest;
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
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

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
    private final RestTemplate restTemplate;

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

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LoginResponse register(RegisterRequest request) {
        // 检查用户名是否已存在
        User existingUser = userMapper.selectByUsername(request.getUsername());
        if (existingUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        // 检查邮箱是否已存在
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            User existingEmail = userMapper.selectByEmail(request.getEmail());
            if (existingEmail != null) {
                throw new RuntimeException("邮箱已被注册");
            }
        }

        // 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setNickname(request.getNickname() != null ? request.getNickname() : request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setGender(2); // 默认未知
        user.setStatus(1); // 默认启用

        userMapper.insert(user);

        // 自动分配普通用户角色
        Role userRole = roleMapper.selectByRoleCode("user");
        if (userRole != null) {
            userMapper.insertUserRole(user.getUserId(), userRole.getRoleId());
        }

        // 生成 Token
        List<String> permissions = new ArrayList<>();
        List<String> roleNames = Arrays.asList("user");

        String token = generateToken(user, permissions);

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

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LoginResponse githubLogin(String code) {
        try {
            // 1. 使用授权码换取 access token
            String accessToken = getGitHubAccessToken(code);

            // 2. 使用 access token 获取 GitHub 用户信息
            Map<String, Object> userInfo = getGitHubUserInfo(accessToken);

            // 3. 提取用户信息
            String githubLogin = (String) userInfo.get("login");
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            String avatar = (String) userInfo.get("avatar_url");

            // 4. 检查用户是否已存在（通过 GitHub ID 或邮箱）
            String githubUsername = "github_" + githubLogin;
            User user = userMapper.selectByUsername(githubUsername);

            if (user == null) {
                // 用户不存在，创建新用户
                user = new User();
                user.setUsername(githubUsername);
                user.setPassword(""); // GitHub 登录不需要密码
                user.setNickname(name != null ? name : githubLogin);
                user.setEmail(email);
                user.setAvatar(avatar);
                user.setGender(2);
                user.setStatus(1);

                userMapper.insert(user);

                // 自动分配普通用户角色
                Role userRole = roleMapper.selectByRoleCode("user");
                if (userRole != null) {
                    userMapper.insertUserRole(user.getUserId(), userRole.getRoleId());
                }
            } else {
                // 更新用户信息
                user.setNickname(name != null ? name : githubLogin);
                if (email != null) {
                    user.setEmail(email);
                }
                user.setAvatar(avatar);
                userMapper.updateById(user);
            }

            // 5. 生成 Token
            List<String> permissions = new ArrayList<>();
            List<String> roleNames = Arrays.asList("user");

            String token = generateToken(user, permissions);

            UserInfo loginUserInfo = new UserInfo(
                    user.getUserId(),
                    user.getUsername(),
                    user.getNickname(),
                    user.getAvatar(),
                    user.getEmail(),
                    user.getPhone(),
                    roleNames,
                    permissions
            );

            // 6. 将 Token 存入 Redis
            String redisKey = "token:" + user.getUserId();
            redisTemplate.opsForValue().set(redisKey, token, jwtConfig.getExpiration(), TimeUnit.MILLISECONDS);

            return new LoginResponse(token, "Bearer", jwtConfig.getExpiration(), loginUserInfo);
        } catch (Exception e) {
            throw new RuntimeException("GitHub 登录失败：" + e.getMessage(), e);
        }
    }

    /**
     * 使用授权码换取 GitHub Access Token
     */
    private String getGitHubAccessToken(String code) {
        String clientId = System.getenv().getOrDefault("GITHUB_CLIENT_ID", "your-client-id");
        String clientSecret = System.getenv().getOrDefault("GITHUB_CLIENT_SECRET", "your-client-secret");
        String redirectUri = System.getenv().getOrDefault("GITHUB_REDIRECT_URI", "http://localhost:3000/login");

        Map<String, String> params = new HashMap<>();
        params.put("client_id", clientId);
        params.put("client_secret", clientSecret);
        params.put("code", code);
        params.put("redirect_uri", redirectUri);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Accept", "application/json");

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(params, headers);
        Map<String, Object> response = restTemplate.postForObject(
                "https://github.com/login/oauth/access_token",
                entity,
                Map.class
        );

        if (response != null && response.containsKey("access_token")) {
            return (String) response.get("access_token");
        }

        throw new RuntimeException("获取 GitHub Access Token 失败");
    }

    /**
     * 获取 GitHub 用户信息
     */
    private Map<String, Object> getGitHubUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        Map<String, Object> response = restTemplate.exchange(
                "https://api.github.com/user",
                org.springframework.http.HttpMethod.GET,
                entity,
                Map.class
        ).getBody();

        if (response == null) {
            throw new RuntimeException("获取 GitHub 用户信息失败");
        }

        return response;
    }
}
