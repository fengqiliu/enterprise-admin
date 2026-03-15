package com.enterprise.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.PageResult;
import com.enterprise.dto.UserDTO;
import com.enterprise.entity.User;
import com.enterprise.mapper.UserMapper;
import com.enterprise.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 用户服务实现类
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PageResult<User> list(String username, String nickname, Integer status, Integer current, Integer size) {
        Page<User> page = new Page<>(current, size);
        
        // 构建查询条件
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getDeleted, 0);
        wrapper.like(username != null && !username.isEmpty(), User::getUsername, username);
        wrapper.like(nickname != null && !nickname.isEmpty(), User::getNickname, nickname);
        wrapper.eq(status != null, User::getStatus, status);
        
        Page<User> userPage = userMapper.selectPage(page, wrapper);
        return PageResult.from(userPage);
    }

    @Override
    public User getById(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void add(UserDTO dto) {
        // 检查用户名是否存在
        User existUser = userMapper.selectByUsername(dto.getUsername());
        if (existUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getNickname());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setAvatar(dto.getAvatar());
        user.setGender(dto.getGender() != null ? dto.getGender() : 2);
        user.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);
        user.setDeptId(dto.getDeptId());
        
        userMapper.insert(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(UserDTO dto) {
        User user = userMapper.selectById(dto.getUserId());
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        user.setNickname(dto.getNickname());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setAvatar(dto.getAvatar());
        user.setGender(dto.getGender());
        user.setStatus(dto.getStatus());
        user.setDeptId(dto.getDeptId());
        
        userMapper.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(List<Long> userIds) {
        for (Long userId : userIds) {
            userMapper.deleteById(userId);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long userId, Integer status) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        user.setStatus(status);
        userMapper.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void resetPassword(Long userId, String password) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        user.setPassword(passwordEncoder.encode(password));
        userMapper.updateById(user);
    }
}