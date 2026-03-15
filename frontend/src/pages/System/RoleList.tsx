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
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  PermIdentity as PermissionIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';

// 角色数据类型
interface Role {
  id: number;
  roleName: string;
  roleCode: string;
  description: string;
  status: 'active' | 'inactive';
  createTime: string;
  permissions: string[];
}

// 模拟权限列表
const permissionList = [
  { module: '用户管理', permissions: ['system:user:list', 'system:user:query', 'system:user:add', 'system:user:edit', 'system:user:delete'] },
  { module: '角色管理', permissions: ['system:role:list', 'system:role:query', 'system:role:add', 'system:role:edit', 'system:role:delete'] },
  { module: '菜单管理', permissions: ['system:menu:list', 'system:menu:query', 'system:menu:add', 'system:menu:edit', 'system:menu:delete'] },
  { module: '部门管理', permissions: ['system:dept:list', 'system:dept:query', 'system:dept:add', 'system:dept:edit', 'system:dept:delete'] },
  { module: '字典管理', permissions: ['business:dict:list', 'business:dict:query', 'business:dict:add', 'business:dict:edit', 'business:dict:delete'] },
  { module: '日志管理', permissions: ['log:operation:list', 'log:login:list'] },
];

// 模拟数据
const initialRoles: Role[] = [
  { id: 1, roleName: '超级管理员', roleCode: 'super_admin', description: '系统超级管理员，拥有所有权限', status: 'active', createTime: '2024-01-01', permissions: ['*'] },
  { id: 2, roleName: '系统管理员', roleCode: 'admin', description: '系统管理员，拥有系统管理权限', status: 'active', createTime: '2024-01-02', permissions: ['system:*'] },
  { id: 3, roleName: '普通用户', roleCode: 'user', description: '普通用户，只有基本查看权限', status: 'active', createTime: '2024-01-03', permissions: ['system:user:query'] },
  { id: 4, roleName: '访客', roleCode: 'guest', description: '访客角色，仅限查看', status: 'inactive', createTime: '2024-01-04', permissions: [] },
];

export const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [searchText, setSearchText] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    roleName: '',
    roleCode: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
  });

  // 权限选择状态
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // 表格列定义
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'roleName', headerName: '角色名称', flex: 1, minWidth: 120 },
    { field: 'roleCode', headerName: '角色编码', flex: 1, minWidth: 150 },
    { field: 'description', headerName: '描述', flex: 1.5, minWidth: 200 },
    {
      field: 'status',
      headerName: '状态',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value === 'active' ? '启用' : '禁用'}
          color={params.value === 'active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'permissionCount',
      headerName: '权限数',
      width: 90,
      valueGetter: (params) => params.row.permissions?.length || 0,
    },
    {
      field: 'createTime',
      headerName: '创建时间',
      width: 160,
      valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 200,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" color="primary" onClick={() => handleView(params.row)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="info" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="warning"
            onClick={() => handlePermission(params.row)}
            title="分配权限"
          >
            <PermissionIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // 处理查看
  const handleView = (role: Role) => {
    setDialogType('view');
    setCurrentRole(role);
    setDialogOpen(true);
  };

  // 处理编辑
  const handleEdit = (role: Role) => {
    setDialogType('edit');
    setCurrentRole(role);
    setFormData({
      roleName: role.roleName,
      roleCode: role.roleCode,
      description: role.description,
      status: role.status,
    });
    setDialogOpen(true);
  };

  // 处理分配权限
  const handlePermission = (role: Role) => {
    setCurrentRole(role);
    setSelectedPermissions(role.permissions || []);
    setPermissionDialogOpen(true);
  };

  // 处理删除
  const handleDelete = (role: Role) => {
    if (window.confirm(`确定要删除角色 "${role.roleName}" 吗？`)) {
      setRoles(roles.filter((r) => r.id !== role.id));
    }
  };

  // 处理新增
  const handleAdd = () => {
    setDialogType('add');
    setCurrentRole(null);
    setFormData({
      roleName: '',
      roleCode: '',
      description: '',
      status: 'active',
    });
    setDialogOpen(true);
  };

  // 处理权限切换
  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  // 处理模块权限全选
  const handleModuleToggle = (permissions: string[], checked: boolean) => {
    if (checked) {
      setSelectedPermissions((prev) => [...new Set([...prev, ...permissions])]);
    } else {
      setSelectedPermissions((prev) => prev.filter((p) => !permissions.includes(p)));
    }
  };

  // 处理表单提交
  const handleSubmit = () => {
    if (!formData.roleName || !formData.roleCode) {
      alert('请填写角色名称和角色编码');
      return;
    }

    if (dialogType === 'add') {
      const newRole: Role = {
        id: Math.max(...roles.map((r) => r.id)) + 1,
        ...formData,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        permissions: [],
      };
      setRoles([...roles, newRole]);
    } else if (dialogType === 'edit' && currentRole) {
      setRoles(
        roles.map((r) =>
          r.id === currentRole.id ? { ...r, ...formData } : r
        )
      );
    }
    setDialogOpen(false);
  };

  // 处理权限分配提交
  const handlePermissionSubmit = () => {
    if (currentRole) {
      setRoles(
        roles.map((r) =>
          r.id === currentRole.id ? { ...r, permissions: selectedPermissions } : r
        )
      );
    }
    setPermissionDialogOpen(false);
  };

  // 过滤数据
  const filteredRoles = roles.filter(
    (role) =>
      role.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
      role.roleCode.toLowerCase().includes(searchText.toLowerCase()) ||
      role.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box>
      {/* 页面标题 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            角色管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            管理系统角色配置，包括角色增删改查和权限分配
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            刷新
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            新增角色
          </Button>
        </Box>
      </Box>

      {/* 搜索栏 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="搜索角色名称/编码/描述"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>状态</InputLabel>
              <Select label="状态" defaultValue="">
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="active">启用</MenuItem>
                <MenuItem value="inactive">禁用</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* 数据表格 */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={filteredRoles}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection as number[]);
            }}
            rowSelectionModel={selectedRows}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                border: 'none',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* 新增/编辑/查看 对话框 */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'add' && '新增角色'}
          {dialogType === 'edit' && '编辑角色'}
          {dialogType === 'view' && '角色详情'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="角色名称"
              value={formData.roleName}
              onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
              disabled={dialogType === 'view'}
              fullWidth
              required
            />
            <TextField
              label="角色编码"
              value={formData.roleCode}
              onChange={(e) => setFormData({ ...formData, roleCode: e.target.value })}
              disabled={dialogType === 'view'}
              fullWidth
              required
            />
            <TextField
              label="描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={dialogType === 'view'}
              fullWidth
              multiline
              rows={3}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === 'active'}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked ? ('active' as 'active' | 'inactive') : ('inactive' as 'active' | 'inactive') })
                  }
                  disabled={dialogType === 'view'}
                />
              }
              label="启用"
            />
            {dialogType === 'view' && currentRole && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    权限列表
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {currentRole.permissions.length > 0 ? (
                      currentRole.permissions.map((p) => (
                        <Chip key={p} label={p} size="small" />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        暂无权限
                      </Typography>
                    )}
                  </Box>
                </Box>
              </>
            )}
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

      {/* 权限分配对话框 */}
      <Dialog
        open={permissionDialogOpen}
        onClose={() => setPermissionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>分配权限 - {currentRole?.roleName}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {permissionList.map((module, moduleIndex) => (
              <Box key={moduleIndex} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, minWidth: 80 }}>
                    {module.module}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={module.permissions.every((p) => selectedPermissions.includes(p))}
                        onChange={(e) =>
                          handleModuleToggle(module.permissions, e.target.checked)
                        }
                      />
                    }
                    label="全选"
                    sx={{ ml: 2 }}
                  />
                </Box>
                <FormGroup row sx={{ pl: 10 }}>
                  {module.permissions.map((permission) => (
                    <FormControlLabel
                      key={permission}
                      control={
                        <Switch
                          checked={selectedPermissions.includes(permission)}
                          onChange={() => handlePermissionToggle(permission)}
                        />
                      }
                      label={permission}
                      sx={{ mr: 2 }}
                    />
                  ))}
                </FormGroup>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermissionDialogOpen(false)}>取消</Button>
          <Button onClick={handlePermissionSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleList;
