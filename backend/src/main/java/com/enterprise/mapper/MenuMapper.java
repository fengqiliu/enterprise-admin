package com.enterprise.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.enterprise.entity.Menu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 菜单 Mapper 接口
 */
@Mapper
public interface MenuMapper extends BaseMapper<Menu> {

    /**
     * 查询用户可见的菜单权限标识列表
     */
    @Select("SELECT DISTINCT m.permission FROM sys_menu m " +
            "INNER JOIN sys_role_menu rm ON m.menu_id = rm.menu_id " +
            "INNER JOIN sys_user_role ur ON rm.role_id = ur.role_id " +
            "WHERE ur.user_id = #{userId} AND m.permission IS NOT NULL AND m.deleted = 0")
    List<String> selectPermissionsByUserId(@Param("userId") Long userId);

    /**
     * 查询角色关联的菜单列表
     */
    @Select("SELECT m.* FROM sys_menu m " +
            "INNER JOIN sys_role_menu rm ON m.menu_id = rm.menu_id " +
            "WHERE rm.role_id = #{roleId} AND m.deleted = 0 ORDER BY m.sort_order")
    List<Menu> selectMenusByRoleId(@Param("roleId") Long roleId);
}
