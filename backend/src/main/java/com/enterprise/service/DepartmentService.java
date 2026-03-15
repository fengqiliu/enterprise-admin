package com.enterprise.service;

import com.enterprise.dto.DepartmentDTO;
import com.enterprise.entity.Department;

import java.util.List;

/**
 * 部门服务接口
 */
public interface DepartmentService {

    List<Department> listTree(String deptName, Integer status);

    List<Department> listAll();

    Department getById(Long deptId);

    void add(DepartmentDTO dto);

    void update(DepartmentDTO dto);

    void delete(Long deptId);
}
