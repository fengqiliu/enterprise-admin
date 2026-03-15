package com.enterprise.service;

import com.enterprise.dto.MenuDTO;
import com.enterprise.entity.Menu;

import java.util.List;

/**
 * 菜单服务接口
 */
public interface MenuService {

    List<Menu> listTree(String menuName, Integer status);

    List<Menu> listAll();

    Menu getById(Long menuId);

    void add(MenuDTO dto);

    void update(MenuDTO dto);

    void delete(Long menuId);
}
