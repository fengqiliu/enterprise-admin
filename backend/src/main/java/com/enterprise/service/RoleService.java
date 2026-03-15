package com.enterprise.service;

import com.enterprise.common.PageResult;
import com.enterprise.dto.RoleDTO;
import com.enterprise.entity.Role;

import java.util.List;

/**
 * 角色服务接口
 */
public interface RoleService {

    PageResult<Role> list(String roleName, String roleCode, Integer status, Integer current, Integer size);

    List<Role> listAll();

    Role getById(Long roleId);

    void add(RoleDTO dto);

    void update(RoleDTO dto);

    void delete(List<Long> roleIds);

    void updateStatus(Long roleId, Integer status);

    void assignMenus(Long roleId, List<Long> menuIds);
}
