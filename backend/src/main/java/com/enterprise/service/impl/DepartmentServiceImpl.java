package com.enterprise.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.enterprise.dto.DepartmentDTO;
import com.enterprise.entity.Department;
import com.enterprise.mapper.DepartmentMapper;
import com.enterprise.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 部门服务实现类
 */
@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentMapper departmentMapper;

    @Override
    public List<Department> listTree(String deptName, Integer status) {
        LambdaQueryWrapper<Department> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(deptName != null && !deptName.isEmpty(), Department::getDeptName, deptName);
        wrapper.eq(status != null, Department::getStatus, status);
        wrapper.orderByAsc(Department::getParentId).orderByAsc(Department::getSortOrder);
        List<Department> allDepts = departmentMapper.selectList(wrapper);
        return buildTree(allDepts, 0L);
    }

    @Override
    public List<Department> listAll() {
        LambdaQueryWrapper<Department> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Department::getParentId).orderByAsc(Department::getSortOrder);
        List<Department> allDepts = departmentMapper.selectList(wrapper);
        return buildTree(allDepts, 0L);
    }

    @Override
    public Department getById(Long deptId) {
        return departmentMapper.selectById(deptId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void add(DepartmentDTO dto) {
        Department dept = new Department();
        dept.setParentId(dto.getParentId() != null ? dto.getParentId() : 0L);
        dept.setDeptName(dto.getDeptName());
        dept.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        dept.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);
        departmentMapper.insert(dept);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(DepartmentDTO dto) {
        Department dept = departmentMapper.selectById(dto.getDeptId());
        if (dept == null) {
            throw new RuntimeException("部门不存在");
        }
        dept.setDeptName(dto.getDeptName());
        dept.setSortOrder(dto.getSortOrder());
        dept.setStatus(dto.getStatus());
        departmentMapper.updateById(dept);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long deptId) {
        // 检查是否有子部门
        LambdaQueryWrapper<Department> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Department::getParentId, deptId);
        long count = departmentMapper.selectCount(wrapper);
        if (count > 0) {
            throw new RuntimeException("该部门存在子部门，无法删除");
        }
        departmentMapper.deleteById(deptId);
    }

    /**
     * 构建部门树
     */
    private List<Department> buildTree(List<Department> allDepts, Long parentId) {
        List<Department> result = new ArrayList<>();
        for (Department dept : allDepts) {
            if (parentId.equals(dept.getParentId())) {
                List<Department> children = buildTree(allDepts, dept.getDeptId());
                dept.setChildren(children.isEmpty() ? null : children);
                result.add(dept);
            }
        }
        return result;
    }
}
