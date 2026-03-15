package com.enterprise.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.PageResult;
import com.enterprise.dto.RoleDTO;
import com.enterprise.entity.Role;
import com.enterprise.mapper.RoleMapper;
import com.enterprise.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 角色服务实现类
 */
@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleMapper roleMapper;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public PageResult<Role> list(String roleName, String roleCode, Integer status, Integer current, Integer size) {
        Page<Role> page = new Page<>(current, size);
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(roleName != null && !roleName.isEmpty(), Role::getRoleName, roleName);
        wrapper.like(roleCode != null && !roleCode.isEmpty(), Role::getRoleCode, roleCode);
        wrapper.eq(status != null, Role::getStatus, status);
        wrapper.orderByAsc(Role::getRoleId);
        Page<Role> rolePage = roleMapper.selectPage(page, wrapper);
        // 填充每个角色的 menuIds
        for (Role role : rolePage.getRecords()) {
            List<Long> menuIds = roleMapper.selectMenuIdsByRoleId(role.getRoleId());
            role.setMenuIds(menuIds);
        }
        return PageResult.from(rolePage);
    }

    @Override
    public List<Role> listAll() {
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Role::getStatus, 1);
        wrapper.orderByAsc(Role::getRoleId);
        return roleMapper.selectList(wrapper);
    }

    @Override
    public Role getById(Long roleId) {
        Role role = roleMapper.selectById(roleId);
        if (role != null) {
            List<Long> menuIds = roleMapper.selectMenuIdsByRoleId(roleId);
            role.setMenuIds(menuIds);
        }
        return role;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void add(RoleDTO dto) {
        // 检查角色编码是否存在
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Role::getRoleCode, dto.getRoleCode());
        if (roleMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("角色编码已存在");
        }
        Role role = new Role();
        role.setRoleName(dto.getRoleName());
        role.setRoleCode(dto.getRoleCode());
        role.setDescription(dto.getDescription());
        role.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);
        roleMapper.insert(role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(RoleDTO dto) {
        Role role = roleMapper.selectById(dto.getRoleId());
        if (role == null) {
            throw new RuntimeException("角色不存在");
        }
        role.setRoleName(dto.getRoleName());
        role.setDescription(dto.getDescription());
        role.setStatus(dto.getStatus());
        roleMapper.updateById(role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(List<Long> roleIds) {
        for (Long roleId : roleIds) {
            roleMapper.deleteById(roleId);
            // 删除角色菜单关联
            jdbcTemplate.update("DELETE FROM sys_role_menu WHERE role_id = ?", roleId);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long roleId, Integer status) {
        Role role = roleMapper.selectById(roleId);
        if (role == null) {
            throw new RuntimeException("角色不存在");
        }
        role.setStatus(status);
        roleMapper.updateById(role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void assignMenus(Long roleId, List<Long> menuIds) {
        // 删除原有菜单关联
        jdbcTemplate.update("DELETE FROM sys_role_menu WHERE role_id = ?", roleId);
        // 插入新的菜单关联
        if (menuIds != null && !menuIds.isEmpty()) {
            for (Long menuId : menuIds) {
                jdbcTemplate.update("INSERT INTO sys_role_menu (role_id, menu_id) VALUES (?, ?)", roleId, menuId);
            }
        }
    }
}
