import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  InputAdornment,
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Web as WebIcon,
  CheckBox as CheckBoxIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

// 菜单数据类型
interface Menu {
  id: number;
  parentId: number;
  menuName: string;
  menuType: 1 | 2 | 3; // 1-目录 2-菜单 3-按钮
  path?: string;
  component?: string;
  permission?: string;
  icon?: string;
  sortOrder: number;
  status: 'active' | 'inactive';
  createTime: string;
  children?: Menu[];
}

// 模拟数据
const initialMenus: Menu[] = [
  {
    id: 1,
    parentId: 0,
    menuName: '系统管理',
    menuType: 1,
    path: '/system',
    icon: 'Settings',
    sortOrder: 1,
    status: 'active',
    createTime: '2024-01-01',
    children: [
      {
        id: 2,
        parentId: 1,
        menuName: '用户管理',
        menuType: 2,
        path: '/system/user',
        component: 'system/UserList',
        icon: 'People',
        permission: 'system:user:list',
        sortOrder: 1,
        status: 'active',
        createTime: '2024-01-02',
        children: [
          { id: 3, parentId: 2, menuName: '用户查询', menuType: 3, permission: 'system:user:query', sortOrder: 1, status: 'active', createTime: '2024-01-02' },
          { id: 4, parentId: 2, menuName: '用户新增', menuType: 3, permission: 'system:user:add', sortOrder: 2, status: 'active', createTime: '2024-01-02' },
          { id: 5, parentId: 2, menuName: '用户修改', menuType: 3, permission: 'system:user:edit', sortOrder: 3, status: 'active', createTime: '2024-01-02' },
          { id: 6, parentId: 2, menuName: '用户删除', menuType: 3, permission: 'system:user:delete', sortOrder: 4, status: 'active', createTime: '2024-01-02' },
        ],
      },
      {
        id: 7,
        parentId: 1,
        menuName: '角色管理',
        menuType: 2,
        path: '/system/role',
        component: 'system/RoleList',
        icon: 'Security',
        permission: 'system:role:list',
        sortOrder: 2,
        status: 'active',
        createTime: '2024-01-03',
        children: [],
      },
      {
        id: 8,
        parentId: 1,
        menuName: '菜单管理',
        menuType: 2,
        path: '/system/menu',
        component: 'system/MenuList',
        icon: 'Assignment',
        permission: 'system:menu:list',
        sortOrder: 3,
        status: 'active',
        createTime: '2024-01-04',
        children: [],
      },
    ],
  },
  {
    id: 10,
    parentId: 0,
    menuName: '业务管理',
    menuType: 1,
    path: '/business',
    icon: 'Assignment',
    sortOrder: 2,
    status: 'active',
    createTime: '2024-01-05',
    children: [
      {
        id: 11,
        parentId: 10,
        menuName: '数据字典',
        menuType: 2,
        path: '/business/dict',
        component: 'business/DictList',
        icon: 'Description',
        permission: 'business:dict:list',
        sortOrder: 1,
        status: 'active',
        createTime: '2024-01-06',
        children: [],
      },
    ],
  },
  {
    id: 13,
    parentId: 0,
    menuName: '日志中心',
    menuType: 1,
    path: '/log',
    icon: 'History',
    sortOrder: 3,
    status: 'active',
    createTime: '2024-01-07',
    children: [
      {
        id: 14,
        parentId: 13,
        menuName: '操作日志',
        menuType: 2,
        path: '/log/operation',
        component: 'log/OperationLog',
        icon: 'Assignment',
        permission: 'log:operation:list',
        sortOrder: 1,
        status: 'active',
        createTime: '2024-01-08',
        children: [],
      },
    ],
  },
];

// 递归渲染树形节点
const renderTree = (
  node: Menu,
  _selectedId: number | null,
  _onSelect: (id: number) => void,
  onEdit: (menu: Menu) => void,
  onDelete: (menu: Menu) => void
) => {
  const getMenuIcon = () => {
    switch (node.menuType) {
      case 1: return <MenuIcon color="primary" />;
      case 2: return <WebIcon sx={{ color: 'success.main' }} />;
      case 3: return <CheckBoxIcon sx={{ color: 'warning.main' }} />;
      default: return <MenuIcon />;
    }
  };

  const getMenuTypeLabel = () => {
    switch (node.menuType) {
      case 1: return '目录';
      case 2: return '菜单';
      case 3: return '按钮';
      default: return '';
    }
  };

  return (
    <TreeItem
      key={node.id}
      itemId={String(node.id)}
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getMenuIcon()}
            <Typography variant="body2" sx={{ fontWeight: node.children && node.children.length > 0 ? 600 : 400 }}>
              {node.menuName}
            </Typography>
            <Chip
              label={getMenuTypeLabel()}
              color={node.menuType === 1 ? 'primary' : node.menuType === 2 ? 'success' : 'warning'}
              size="small"
              sx={{ height: 20 }}
            />
            {node.permission && (
              <Chip label={node.permission} size="small" sx={{ height: 20, bgcolor: 'action.disabled' }} />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(node); }}>
              <EditIcon fontSize="small" />
            </IconButton>
            {node.parentId !== 0 && (
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(node); }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      }
    />
  );
};

// 递归渲染菜单选择器
const renderMenuSelect = (menus: Menu[], level: number = 0): React.JSX.Element[] => {
  return menus.flatMap((menu) => [
    <MenuItem key={menu.id} value={menu.id} sx={{ pl: level * 2 }}>
      {level > 0 && '└─ '}{menu.menuName}
    </MenuItem>,
    ...(menu.children ? renderMenuSelect(menu.children, level + 1) : []),
  ]) as React.JSX.Element[];
};

// 递归查找菜单
const findMenu = (menus: Menu[], id: number): Menu | null => {
  for (const menu of menus) {
    if (menu.id === id) return menu;
    if (menu.children) {
      const found = findMenu(menu.children, id);
      if (found) return found;
    }
  }
  return null;
};

// 递归更新菜单
const updateMenu = (menus: Menu[], updatedMenu: Menu): Menu[] => {
  return menus.map((menu) => {
    if (menu.id === updatedMenu.id) {
      return { ...menu, ...updatedMenu };
    }
    if (menu.children) {
      return { ...menu, children: updateMenu(menu.children, updatedMenu) };
    }
    return menu;
  });
};

// 递归删除菜单
const deleteMenuFromTree = (menus: Menu[], id: number): Menu[] => {
  return menus
    .filter((menu) => menu.id !== id)
    .map((menu) => ({
      ...menu,
      children: menu.children ? deleteMenuFromTree(menu.children, id) : undefined,
    }));
};

// 递归添加菜单
const addMenuToTree = (menus: Menu[], newMenu: Menu): Menu[] => {
  if (newMenu.parentId === 0) {
    return [...menus, newMenu];
  }
  return menus.map((menu) => {
    if (menu.id === newMenu.parentId) {
      return {
        ...menu,
        children: [...(menu.children || []), newMenu],
      };
    }
    if (menu.children) {
      return {
        ...menu,
        children: addMenuToTree(menu.children, newMenu),
      };
    }
    return menu;
  });
};

export const MenuList: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    parentId: '0',
    menuName: '',
    menuType: 1 as 1 | 2 | 3,
    path: '',
    component: '',
    permission: '',
    icon: '',
    sortOrder: 1,
    status: 'active' as 'active' | 'inactive',
  });

  // 处理编辑
  const handleEdit = (menu: Menu) => {
    setDialogType('edit');
    setCurrentMenu(menu);
    setFormData({
      parentId: String(menu.parentId),
      menuName: menu.menuName,
      menuType: menu.menuType,
      path: menu.path || '',
      component: menu.component || '',
      permission: menu.permission || '',
      icon: menu.icon || '',
      sortOrder: menu.sortOrder,
      status: menu.status as 'active' | 'inactive',
    });
    setDialogOpen(true);
  };

  // 处理删除
  const handleDelete = (menu: Menu) => {
    if (window.confirm(`确定要删除菜单 "${menu.menuName}" 吗？`)) {
      setMenus(deleteMenuFromTree(menus, menu.id));
    }
  };

  // 处理新增
  const handleAdd = () => {
    setDialogType('add');
    setCurrentMenu(null);
    setFormData({
      parentId: String(selectedId || 0),
      menuName: '',
      menuType: 1,
      path: '',
      component: '',
      permission: '',
      icon: '',
      sortOrder: 1,
      status: 'active',
    });
    setDialogOpen(true);
  };

  // 处理表单提交
  const handleSubmit = () => {
    if (!formData.menuName) {
      alert('请填写菜单名称');
      return;
    }

    if (dialogType === 'add') {
      const newMenu: Menu = {
        id: Math.max(...menus.flatMap((d) => [d.id, ...(d.children?.map((c) => c.id) || [])])) + 1,
        ...formData,
        parentId: Number(formData.parentId),
        createTime: dayjs().format('YYYY-MM-DD'),
        children: [],
      };
      setMenus(addMenuToTree(menus, newMenu));
    } else if (dialogType === 'edit' && currentMenu) {
      const updatedMenu: Menu = {
        ...currentMenu,
        ...formData,
        parentId: currentMenu.parentId,
      };
      setMenus(updateMenu(menus, updatedMenu));
    }
    setDialogOpen(false);
  };

  const getMenuTypeLabel = (type: number) => {
    switch (type) {
      case 1: return '目录';
      case 2: return '菜单';
      case 3: return '按钮';
      default: return '';
    }
  };

  return (
    <Box>
      {/* 页面标题 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            菜单管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            管理系统菜单结构，包括目录、菜单、按钮及权限标识
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            刷新
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            新增菜单
          </Button>
        </Box>
      </Box>

      {/* 搜索栏 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="搜索菜单名称"
              value={formData.menuName}
              onChange={(e) => setFormData({ ...formData, menuName: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280 }}
            />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* 左侧树形结构 */}
        <Card sx={{ flex: 1, minWidth: 500 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              菜单结构
            </Typography>
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{ flexGrow: 1 }}
            >
              {menus.map((menu) =>
                renderTree(menu, selectedId, setSelectedId, handleEdit, handleDelete)
              )}
            </TreeView>
          </CardContent>
        </Card>

        {/* 右侧详情/操作 */}
        <Card sx={{ width: 350 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              {selectedId ? '菜单详情' : '选择菜单查看'}
            </Typography>
            {selectedId && (() => {
              const menu = findMenu(menus, selectedId);
              if (!menu) return <Typography color="text.secondary">未找到菜单</Typography>;

              return (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      菜单名称
                    </Typography>
                    <Typography variant="h6">{menu.menuName}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      菜单类型
                    </Typography>
                    <Chip
                      label={getMenuTypeLabel(menu.menuType)}
                      color={menu.menuType === 1 ? 'primary' : menu.menuType === 2 ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  {menu.path && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        路由地址
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">{menu.path}</Typography>
                    </Box>
                  )}
                  {menu.component && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        组件路径
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">{menu.component}</Typography>
                    </Box>
                  )}
                  {menu.permission && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        权限标识
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">{menu.permission}</Typography>
                    </Box>
                  )}
                  {menu.icon && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        图标
                      </Typography>
                      <Typography variant="body1">{menu.icon}</Typography>
                    </Box>
                  )}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      排序
                    </Typography>
                    <Typography variant="body1">{menu.sortOrder}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      状态
                    </Typography>
                    <Chip
                      label={menu.status === 'active' ? '启用' : '禁用'}
                      color={menu.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      fullWidth
                      onClick={() => handleEdit(menu)}
                    >
                      编辑
                    </Button>
                  </Box>
                </Box>
              );
            })()}
          </CardContent>
        </Card>
      </Box>

      {/* 新增/编辑/查看 对话框 */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'add' && '新增菜单'}
          {dialogType === 'edit' && '编辑菜单'}
          {dialogType === 'view' && '菜单详情'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>上级菜单</InputLabel>
              <Select
                value={formData.parentId}
                label="上级菜单"
                onChange={(e: SelectChangeEvent) =>
                  setFormData({ ...formData, parentId: e.target.value })
                }
                disabled={dialogType === 'edit'}
              >
                <MenuItem value="0">顶级菜单</MenuItem>
                {renderMenuSelect(menus)}
              </Select>
            </FormControl>

            <TextField
              label="菜单名称"
              value={formData.menuName}
              onChange={(e) => setFormData({ ...formData, menuName: e.target.value })}
              disabled={dialogType === 'view'}
              fullWidth
              required
            />

            <FormControl fullWidth>
              <FormLabel id="menu-type-label">菜单类型</FormLabel>
              <RadioGroup
                row
                aria-labelledby="menu-type-label"
                value={formData.menuType}
                onChange={(e) => setFormData({ ...formData, menuType: Number(e.target.value) as 1 | 2 | 3 })}
              >
                <FormControlLabel value={1} control={<Radio />} label="目录" disabled={dialogType === 'view'} />
                <FormControlLabel value={2} control={<Radio />} label="菜单" disabled={dialogType === 'view'} />
                <FormControlLabel value={3} control={<Radio />} label="按钮" disabled={dialogType === 'view'} />
              </RadioGroup>
            </FormControl>

            <TextField
              label="排序"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
              disabled={dialogType === 'view'}
              fullWidth
            />

            {formData.menuType !== 3 && (
              <>
                <TextField
                  label="路由地址"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  disabled={dialogType === 'view'}
                  fullWidth
                  placeholder="/system/example"
                />

                <TextField
                  label="组件路径"
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  disabled={dialogType === 'view'}
                  fullWidth
                  placeholder="system/Example"
                />
              </>
            )}

            {formData.menuType !== 1 && (
              <TextField
                label="权限标识"
                value={formData.permission}
                onChange={(e) => setFormData({ ...formData, permission: e.target.value })}
                disabled={dialogType === 'view'}
                fullWidth
                placeholder="system:example:list"
              />
            )}

            <TextField
              label="图标"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              disabled={dialogType === 'view'}
              fullWidth
              placeholder="Menu"
            />

            <FormControl fullWidth>
              <InputLabel>状态</InputLabel>
              <Select
                value={formData.status}
                label="状态"
                onChange={(e: SelectChangeEvent) =>
                  setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                }
                disabled={dialogType === 'view'}
              >
                <MenuItem value="active">启用</MenuItem>
                <MenuItem value="inactive">禁用</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          {dialogType !== 'view' && (
            <Button onClick={handleSubmit} variant="contained">
              确定
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuList;
