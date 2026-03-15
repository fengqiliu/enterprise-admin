package com.enterprise.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.PageResult;
import com.enterprise.dto.UserDTO;
import com.enterprise.entity.User;

import java.util.List;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 分页查询用户列表
     */
    PageResult<User> list(String username, String nickname, Integer status, Integer current, Integer size);

    /**
     * 根据 ID 查询用户
     */
    User getById(Long userId);

    /**
     * 新增用户
     */
    void add(UserDTO dto);

    /**
     * 修改用户
     */
    void update(UserDTO dto);

    /**
     * 删除用户
     */
    void delete(List<Long> userIds);

    /**
     * 修改用户状态
     */
    void updateStatus(Long userId, Integer status);

    /**
     * 重置密码
     */
    void resetPassword(Long userId, String password);
}