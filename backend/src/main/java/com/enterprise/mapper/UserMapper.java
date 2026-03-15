package com.enterprise.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * 用户 Mapper 接口
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

    /**
     * 根据用户名查询用户
     * @param username 用户名
     * @return 用户实体
     */
    @Select("SELECT * FROM sys_user WHERE username = #{username} AND deleted = 0")
    User selectByUsername(@Param("username") String username);

    /**
     * 分页查询用户列表
     * @param page 分页对象
     * @param username 用户名（模糊）
     * @param nickname 昵称（模糊）
     * @param status 状态
     * @return 分页结果
     */
    IPage<User> selectUserPage(Page<User> page,
                               @Param("username") String username,
                               @Param("nickname") String nickname,
                               @Param("status") Integer status);
}