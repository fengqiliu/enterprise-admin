import React, { useState, useEffect, useCallback } from 'react';
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
  Switch,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { http, PageData } from '@services/api';

interface ConfigRecord {
  configId: number;
  configName: string;
  configKey: string;
  configValue: string;
  configType: string;
  description?: string;
  isEditable: number;
  status: number;
  createTime: string;
  updateTime: string;
}

export const ConfigList: React.FC = () => {
  // 列表状态
  const [configs, setConfigs] = useState<ConfigRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  // 搜索状态
  const [searchConfigName, setSearchConfigName] = useState('');
  const [searchConfigKey, setSearchConfigKey] = useState('');
  const [searchConfigType, setSearchConfigType] = useState('');
  const [searchStatus, setSearchStatus] = useState<number | undefined>(undefined);

  // 编辑对话框
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ConfigRecord | null>(null);
  const [form, setForm] = useState({
    configName: '',
    configKey: '',
    configValue: '',
    configType: '',
    description: '',
    isEditable: 1,
    status: 1,
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showMessage = (msg: string, severity: 'success' | 'error' = 'success') =>
    setSnackbar({ open: true, message: msg, severity });

  // 加载列表
  const loadConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        current: pagination.page + 1,
        size: pagination.pageSize,
      };
      if (searchConfigName) params.configName = searchConfigName;
      if (searchConfigKey) params.configKey = searchConfigKey;
      if (searchConfigType) params.configType = searchConfigType;
      if (searchStatus !== undefined) params.status = searchStatus;

      const res = await http.get<PageData<ConfigRecord>>('/business/config/list', params);
      setConfigs(res.records || []);
      setTotal(Number(res.total) || 0);
    } catch (err: any) {
      showMessage(err?.message || '加载失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination, searchConfigName, searchConfigKey, searchConfigType, searchStatus]);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  // 刷新缓存
  const handleRefreshCache = async () => {
    try {
      await http.post('/business/config/refresh');
      showMessage('缓存刷新成功');
    } catch (err: any) {
      showMessage(err?.message || '刷新缓存失败', 'error');
    }
  };

  // 表格列定义
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'configName', headerName: '参数名称', flex: 1, minWidth: 150 },
    { field: 'configKey', headerName: '参数键', flex: 1.2, minWidth: 180 },
    { field: 'configValue', headerName: '参数值', flex: 1.2, minWidth: 200 },
    {
      field: 'configType',
      headerName: '分组类型',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => <Chip label={params.value || 'sys'} size="small" color="primary" variant="outlined" />,
    },
    { field: 'description', headerName: '描述', flex: 1.2, minWidth: 180 },
    {
      field: 'status',
      headerName: '状态',
      width: 80,
      renderCell: (params) => (
        <Chip label={params.value === 1 ? '启用' : '禁用'} color={params.value === 1 ? 'success' : 'default'} size="small" />
      ),
    },
    {
      field: 'isEditable',
      headerName: '可编辑',
      width: 80,
      renderCell: (params) => (
        <Chip label={params.value === 1 ? '是' : '否'} color={params.value === 1 ? 'info' : 'default'} size="small" />
      ),
    },
    {
      field: 'createTime',
      headerName: '创建时间',
      width: 160,
      valueFormatter: (params) => params.value ? dayjs(params.value).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Box>
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

  const gridRows = configs.map((c) => ({ ...c, id: c.configId }));

  // 新增
  const handleAdd = () => {
    setEditingConfig(null);
    setForm({
      configName: '',
      configKey: '',
      configValue: '',
      configType: 'sys',
      description: '',
      isEditable: 1,
      status: 1,
    });
    setDialogOpen(true);
  };

  // 编辑
  const handleEdit = (config: ConfigRecord) => {
    setEditingConfig(config);
    setForm({
      configName: config.configName,
      configKey: config.configKey,
      configValue: config.configValue,
      configType: config.configType || 'sys',
      description: config.description || '',
      isEditable: config.isEditable,
      status: config.status,
    });
    setDialogOpen(true);
  };

  // 删除
  const handleDelete = async (config: ConfigRecord) => {
    if (config.isEditable === 0) {
      showMessage('该参数不可删除', 'error');
      return;
    }
    if (!window.confirm(`确定要删除参数 "${config.configName}" 吗？`)) return;
    try {
      await http.delete(`/business/config/${config.configId}`);
      showMessage('删除成功');
      loadConfigs();
    } catch (err: any) {
      showMessage(err?.message || '删除失败', 'error');
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    // 验证
    if (!form.configName || !form.configKey) {
      showMessage('参数名称和参数键为必填项', 'error');
      return;
    }

    try {
      if (editingConfig) {
        if (editingConfig.isEditable === 0) {
          showMessage('该参数不可编辑', 'error');
          return;
        }
        await http.put('/business/config', { configId: editingConfig.configId, ...form });
        showMessage('修改成功');
      } else {
        await http.post('/business/config', form);
        showMessage('新增成功');
      }
      setDialogOpen(false);
      loadConfigs();
    } catch (err: any) {
      showMessage(err?.message || '操作失败', 'error');
    }
  };

  // 搜索
  const handleSearch = () => {
    setPagination({ ...pagination, page: 0 });
    loadConfigs();
  };

  const handleReset = () => {
    setSearchConfigName('');
    setSearchConfigKey('');
    setSearchConfigType('');
    setSearchStatus(undefined);
    setPagination({ ...pagination, page: 0 });
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>系统参数配置</Typography>
          <Typography variant="body2" color="text.secondary">管理系统运行时动态配置参数</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefreshCache}>刷新缓存</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>新增参数</Button>
        </Box>
      </Box>

      {/* 搜索栏 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="搜索参数名称"
              value={searchConfigName}
              onChange={(e) => setSearchConfigName(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              sx={{ minWidth: 180 }}
            />
            <TextField
              size="small"
              placeholder="搜索参数键"
              value={searchConfigKey}
              onChange={(e) => setSearchConfigKey(e.target.value)}
              sx={{ minWidth: 180 }}
            />
            <TextField
              size="small"
              placeholder="分组类型"
              value={searchConfigType}
              onChange={(e) => setSearchConfigType(e.target.value)}
              sx={{ minWidth: 120 }}
            />
            <TextField
              size="small"
              select
              SelectProps={{ native: true }}
              value={searchStatus !== undefined ? searchStatus : ''}
              onChange={(e) => setSearchStatus(e.target.value === '' ? undefined : Number(e.target.value))}
              sx={{ minWidth: 100 }}
            >
              <option value="">全部状态</option>
              <option value="1">启用</option>
              <option value="0">禁用</option>
            </TextField>
            <Button variant="contained" onClick={handleSearch}>搜索</Button>
            <Button variant="outlined" onClick={handleReset}>重置</Button>
          </Box>
        </CardContent>
      </Card>

      {/* 数据表格 */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={gridRows}
            columns={columns}
            loading={loading}
            rowCount={total}
            paginationMode="server"
            paginationModel={pagination}
            onPaginationModelChange={setPagination}
            disableRowSelectionOnClick
            autoHeight
            pageSizeOptions={[10, 20, 50]}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': { border: 'none' },
              '& .MuiDataGrid-columnHeaders': { backgroundColor: 'action.hover' },
            }}
          />
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingConfig ? '编辑参数' : '新增参数'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="参数名称"
                value={form.configName}
                onChange={(e) => setForm({ ...form, configName: e.target.value })}
                fullWidth
                required
                placeholder="例如：用户注册开关"
              />
              <TextField
                label="参数键"
                value={form.configKey}
                onChange={(e) => setForm({ ...form, configKey: e.target.value })}
                fullWidth
                required
                disabled={!!editingConfig}
                placeholder="例如：sys.user.register"
                helperText="格式：模块。功能。子功能"
              />
            </Box>
            <TextField
              label="参数值"
              value={form.configValue}
              onChange={(e) => setForm({ ...form, configValue: e.target.value })}
              fullWidth
              placeholder="例如：true"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="分组类型"
                value={form.configType}
                onChange={(e) => setForm({ ...form, configType: e.target.value })}
                fullWidth
                placeholder="例如：sys, business"
              />
              <TextField
                label="描述"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                fullWidth
                placeholder="参数描述信息"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Switch
                checked={form.isEditable === 1}
                onChange={(e) => setForm({ ...form, isEditable: e.target.checked ? 1 : 0 })}
              />
              <span style={{ alignSelf: 'center' }}>可编辑</span>
              <Switch
                checked={form.status === 1}
                onChange={(e) => setForm({ ...form, status: e.target.checked ? 1 : 0 })}
              />
              <span style={{ alignSelf: 'center' }}>启用</span>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={handleSubmit} variant="contained">确定</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfigList;
