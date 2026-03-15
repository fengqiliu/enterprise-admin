import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import dayjs from 'dayjs';

// 用户数据类型
interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  department: string;
  createTime: string;
}

// 模拟数据
const initialUsers: User[] = [
  { id: 1, username: 'admin', nickname: '管理员', email: 'admin@example.com', phone: '13800138000', role: '超级管理员', status: 'active', department: '技术部', createTime: '2024-01-01' },
  { id: 2, username: 'zhangsan', nickname: '张三', email: 'zhangsan@example.com', phone: '13800138001', role: '普通用户', status: 'active', department: '市场部', createTime: '2024-01-02' },
  { id: 3, username: 'lisi', nickname: '李四', email: 'lisi@example.com', phone: '13800138002', role: '普通用户', status: 'inactive', department: '销售部', createTime: '2024-01-03' },
  { id: 4, username: 'wangwu', nickname: '王五', email: 'wangwu@example.com', phone: '13800138003', role: '部门经理', status: 'active', department: '技术部', createTime: '2024-01-04' },
  { id: 5, username: 'zhaoliu', nickname: '赵六', email: 'zhaoliu@example.com', phone: '13800138004', role: '普通用户', status: 'active', department: '财务部', createTime: '2024-01-05' },
];

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchText, setSearchText] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    email: '',
    phone: '',
    role: '',
    status: 'active' as 'active' | 'inactive',
    department: '',
  });

  // 表格列定义
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'username', headerName: '用户名', width: 120 },
    { field: 'nickname', headerName: '昵称', width: 100 },
    { field: 'email', headerName: '邮箱', flex: 1, minWidth: 180 },
    { field: 'phone', headerName: '手机号', width: 130 },
    { field: 'role', headerName: '角色', flex: 1, minWidth: 120 },
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
    { field: 'department', headerName: '部门', flex: 1, minWidth: 100 },
    {
      field: 'createTime',
      headerName: '创建时间',
      width: 160,
      valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD'),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 180,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" color="primary" onClick={() => handleView(params.row)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="info" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // 处理查看
  const handleView = (user: User) => {
    setDialogType('view');
    setCurrentUser(user);
    setDialogOpen(true);
  };

  // 处理编辑
  const handleEdit = (user: User) => {
    setDialogType('edit');
    setCurrentUser(user);
    setFormData({
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status as 'active' | 'inactive',
      department: user.department,
    });
    setDialogOpen(true);
  };

  // 处理删除
  const handleDelete = (user: User) => {
    if (window.confirm(`确定要删除用户 "${user.nickname}" 吗？`)) {
      setUsers(users.filter((u) => u.id !== user.id));
    }
  };

  // 处理新增
  const handleAdd = () => {
    setDialogType('add');
    setCurrentUser(null);
    setFormData({
      username: '',
      nickname: '',
      email: '',
      phone: '',
      role: '',
      status: 'active',
      department: '',
    });
    setDialogOpen(true);
  };

  // 处理表单提交
  const handleSubmit = () => {
    if (dialogType === 'add') {
      const newUser: User = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        ...formData,
        createTime: dayjs().format('YYYY-MM-DD'),
      } as User;
      setUsers([...users, newUser]);
    } else if (dialogType === 'edit' && currentUser) {
      setUsers(
        users.map((u) =>
          u.id === currentUser.id ? { ...u, ...formData } : u
        )
      );
    }
    setDialogOpen(false);
  };

  // 过滤数据
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.nickname.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box>
      {/* 页面标题 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            用户管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            管理系统用户信息，包括添加、编辑、删除用户
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            导出
          </Button>
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            刷新
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            新增用户
          </Button>
        </Box>
      </Box>

      {/* 搜索栏 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="搜索用户名/昵称/邮箱"
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
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>状态</InputLabel>
              <Select label="状态" defaultValue="">
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="active">启用</MenuItem>
                <MenuItem value="inactive">禁用</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>角色</InputLabel>
              <Select label="角色" defaultValue="">
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="超级管理员">超级管理员</MenuItem>
                <MenuItem value="部门经理">部门经理</MenuItem>
                <MenuItem value="普通用户">普通用户</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>部门</InputLabel>
              <Select label="部门" defaultValue="">
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="技术部">技术部</MenuItem>
                <MenuItem value="市场部">市场部</MenuItem>
                <MenuItem value="销售部">销售部</MenuItem>
                <MenuItem value="财务部">财务部</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* 数据表格 */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={filteredUsers}
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
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
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
          {dialogType === 'add' && '新增用户'}
          {dialogType === 'edit' && '编辑用户'}
          {dialogType === 'view' && '用户详情'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="用户名"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={dialogType === 'view'}
              fullWidth
            />
            <TextField
              label="昵称"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              disabled={dialogType === 'view'}
              fullWidth
            />
            <TextField
              label="邮箱"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={dialogType === 'view'}
              fullWidth
            />
            <TextField
              label="手机号"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={dialogType === 'view'}
              fullWidth
            />
            <FormControl fullWidth disabled={dialogType === 'view'}>
              <InputLabel>角色</InputLabel>
              <Select
                value={formData.role}
                label="角色"
                onChange={(e: SelectChangeEvent) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <MenuItem value="超级管理员">超级管理员</MenuItem>
                <MenuItem value="部门经理">部门经理</MenuItem>
                <MenuItem value="普通用户">普通用户</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={dialogType === 'view'}>
              <InputLabel>部门</InputLabel>
              <Select
                value={formData.department}
                label="部门"
                onChange={(e: SelectChangeEvent) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                <MenuItem value="技术部">技术部</MenuItem>
                <MenuItem value="市场部">市场部</MenuItem>
                <MenuItem value="销售部">销售部</MenuItem>
                <MenuItem value="财务部">财务部</MenuItem>
              </Select>
            </FormControl>
            {dialogType === 'view' && currentUser && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  创建时间：{currentUser.createTime}
                </Typography>
              </Box>
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
    </Box>
  );
};

export default UserList;