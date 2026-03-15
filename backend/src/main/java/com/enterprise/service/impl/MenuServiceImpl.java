package com.enterprise.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.enterprise.dto.MenuDTO;
import com.enterprise.entity.Menu;
import com.enterprise.mapper.MenuMapper;
import com.enterprise.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 菜单服务实现类
 */
@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final MenuMapper menuMapper;

    @Override
    public List<Menu> listTree(String menuName, Integer status) {
        LambdaQueryWrapper<Menu> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(menuName != null && !menuName.isEmpty(), Menu::getMenuName, menuName);
        wrapper.eq(status != null, Menu::getStatus, status);
        wrapper.orderByAsc(Menu::getParentId).orderByAsc(Menu::getSortOrder);
        List<Menu> allMenus = menuMapper.selectList(wrapper);
        return buildTree(allMenus, 0L);
    }

    @Override
    public List<Menu> listAll() {
        LambdaQueryWrapper<Menu> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Menu::getParentId).orderByAsc(Menu::getSortOrder);
        List<Menu> allMenus = menuMapper.selectList(wrapper);
        return buildTree(allMenus, 0L);
    }

    @Override
    public Menu getById(Long menuId) {
        return menuMapper.selectById(menuId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void add(MenuDTO dto) {
        Menu menu = new Menu();
        menu.setParentId(dto.getParentId() != null ? dto.getParentId() : 0L);
        menu.setMenuName(dto.getMenuName());
        menu.setMenuType(dto.getMenuType());
        menu.setPath(dto.getPath());
        menu.setComponent(dto.getComponent());
        menu.setPermission(dto.getPermission());
        menu.setIcon(dto.getIcon());
        menu.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        menu.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);
        menuMapper.insert(menu);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(MenuDTO dto) {
        Menu menu = menuMapper.selectById(dto.getMenuId());
        if (menu == null) {
            throw new RuntimeException("菜单不存在");
        }
        menu.setMenuName(dto.getMenuName());
        menu.setMenuType(dto.getMenuType());
        menu.setPath(dto.getPath());
        menu.setComponent(dto.getComponent());
        menu.setPermission(dto.getPermission());
        menu.setIcon(dto.getIcon());
        menu.setSortOrder(dto.getSortOrder());
        menu.setStatus(dto.getStatus());
        menuMapper.updateById(menu);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long menuId) {
        // 检查是否有子菜单
        LambdaQueryWrapper<Menu> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Menu::getParentId, menuId);
        long count = menuMapper.selectCount(wrapper);
        if (count > 0) {
            throw new RuntimeException("该菜单存在子菜单，无法删除");
        }
        menuMapper.deleteById(menuId);
    }

    /**
     * 构建菜单树
     */
    private List<Menu> buildTree(List<Menu> allMenus, Long parentId) {
        List<Menu> result = new ArrayList<>();
        for (Menu menu : allMenus) {
            if (parentId.equals(menu.getParentId())) {
                List<Menu> children = buildTree(allMenus, menu.getMenuId());
                menu.setChildren(children.isEmpty() ? null : children);
                result.add(menu);
            }
        }
        return result;
    }
}
