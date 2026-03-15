package com.enterprise.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.enterprise.entity.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 角色 Mapper 接口
 */
@Mapper
public interface RoleMapper extends BaseMapper<Role> {

    /**
     * 查询用户的角色列表
     */
    @Select("SELECT r.* FROM sys_role r " +
            "INNER JOIN sys_user_role ur ON r.role_id = ur.role_id " +
            "WHERE ur.user_id = #{userId} AND r.deleted = 0")
    List<Role> selectRolesByUserId(@Param("userId") Long userId);

    /**
     * 查询角色关联的菜单 ID 列表
     */
    @Select("SELECT menu_id FROM sys_role_menu WHERE role_id = #{roleId}")
    List<Long> selectMenuIdsByRoleId(@Param("roleId") Long roleId);
}
