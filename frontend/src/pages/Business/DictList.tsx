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
  FormControlLabel,
  Tabs,
  Tab,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { http, PageData } from '@services/api';

interface DictRecord {
  dictId: number;
  dictName: string;
  dictType: string;
  remark?: string;
  createTime: string;
}

interface DictItemRecord {
  itemId: number;
  dictId: number;
  itemLabel: string;
  itemValue: string;
  sortOrder: number;
  status: number;
  createTime: string;
}

export const DictList: React.FC = () => {
  // 字典类型列表状态
  const [dicts, setDicts] = useState<DictRecord[]>([]);
  const [dictTotal, setDictTotal] = useState(0);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictPagination, setDictPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [searchDictName, setSearchDictName] = useState('');
  const [searchDictType, setSearchDictType] = useState('');

  // 字典项列表状态
  const [items, setItems] = useState<DictItemRecord[]>([]);
  const [itemTotal, setItemTotal] = useState(0);
  const [itemLoading, setItemLoading] = useState(false);
  const [itemPagination, setItemPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  // 选中的字典
  const [selectedDict, setSelectedDict] = useState<DictRecord | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // 字典类型对话框
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<DictRecord | null>(null);
  const [typeForm, setTypeForm] = useState({ dictName: '', dictType: '', remark: '' });

  // 字典项对话框
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DictItemRecord | null>(null);
  const [itemForm, setItemForm] = useState({ itemLabel: '', itemValue: '', sortOrder: 1, status: 1 });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const showMessage = (msg: string, severity: 'success' | 'error' = 'success') =>
    setSnackbar({ open: true, message: msg, severity });

  // 加载字典类型列表
  const loadDicts = useCallback(async () => {
    setDictLoading(true);
    try {
      const params: Record<string, any> = {
        current: dictPagination.page + 1,
        size: dictPagination.pageSize,
      };
      if (searchDictName) params.dictName = searchDictName;
      if (searchDictType) params.dictType = searchDictType;
      const res = await http.get<PageData<DictRecord>>('/business/dict/list', params);
      setDicts(res.records || []);
      setDictTotal(Number(res.total) || 0);
    } catch (err: any) {
      showMessage(err?.message || '加载失败', 'error');
    } finally {
      setDictLoading(false);
    }
  }, [dictPagination, searchDictName, searchDictType]);

  // 加载字典项列表
  const loadItems = useCallback(async () => {
    if (!selectedDict) return;
    setItemLoading(true);
    try {
      const res = await http.get<PageData<DictItemRecord>>(
        `/business/dict/${selectedDict.dictId}/items/page`,
        { current: itemPagination.page + 1, size: itemPagination.pageSize }
      );
      setItems(res.records || []);
      setItemTotal(Number(res.total) || 0);
    } catch (err: any) {
      showMessage(err?.message || '加载字典项失败', 'error');
    } finally {
      setItemLoading(false);
    }
  }, [selectedDict, itemPagination]);

  useEffect(() => { loadDicts(); }, [loadDicts]);
  useEffect(() => { if (selectedDict) loadItems(); }, [loadItems]);

  // 字典类型表格列
  const typeColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'dictName', headerName: '字典名称', width: 150 },
    { field: 'dictType', headerName: '字典类型', width: 160 },
    { field: 'remark', headerName: '备注', width: 200, flex: 1 },
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
          <IconButton size="small" color="info" onClick={() => handleEditType(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="primary" title="查看字典项"
            onClick={() => { setSelectedDict(params.row); setTabValue(1); }}>
            <DescriptionIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDeleteType(params.row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // 字典项表格列
  const itemColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'itemLabel', headerName: '字典标签', width: 150 },
    { field: 'itemValue', headerName: '字典值', width: 150 },
    { field: 'sortOrder', headerName: '排序', width: 80 },
    {
      field: 'status',
      headerName: '状态',
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value === 1 ? '启用' : '禁用'} color={params.value === 1 ? 'success' : 'default'} size="small" />
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
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" color="info" onClick={() => handleEditItem(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDeleteItem(params.row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const dictGridRows = dicts.map((d) => ({ ...d, id: d.dictId }));
  const itemGridRows = items.map((i) => ({ ...i, id: i.itemId }));

  // 字典类型操作
  const handleAddType = () => {
    setEditingType(null);
    setTypeForm({ dictName: '', dictType: '', remark: '' });
    setTypeDialogOpen(true);
  };

  const handleEditType = (dict: DictRecord) => {
    setEditingType(dict);
    setTypeForm({ dictName: dict.dictName, dictType: dict.dictType, remark: dict.remark || '' });
    setTypeDialogOpen(true);
  };

  const handleDeleteType = async (dict: DictRecord) => {
    if (!window.confirm(`确定要删除字典 "${dict.dictName}" 吗？同时会删除所有关联的字典项。`)) return;
    try {
      await http.delete(`/business/dict/${dict.dictId}`);
      showMessage('删除成功');
      if (selectedDict?.dictId === dict.dictId) setSelectedDict(null);
      loadDicts();
    } catch (err: any) {
      showMessage(err?.message || '删除失败', 'error');
    }
  };

  const handleTypeSubmit = async () => {
    try {
      if (editingType) {
        await http.put('/business/dict', { dictId: editingType.dictId, ...typeForm });
        showMessage('修改成功');
      } else {
        await http.post('/business/dict', typeForm);
        showMessage('新增成功');
      }
      setTypeDialogOpen(false);
      loadDicts();
    } catch (err: any) {
      showMessage(err?.message || '操作失败', 'error');
    }
  };

  // 字典项操作
  const handleAddItem = () => {
    if (!selectedDict) return;
    setEditingItem(null);
    setItemForm({ itemLabel: '', itemValue: '', sortOrder: items.length + 1, status: 1 });
    setItemDialogOpen(true);
  };

  const handleEditItem = (item: DictItemRecord) => {
    setEditingItem(item);
    setItemForm({ itemLabel: item.itemLabel, itemValue: item.itemValue, sortOrder: item.sortOrder, status: item.status });
    setItemDialogOpen(true);
  };

  const handleDeleteItem = async (item: DictItemRecord) => {
    if (!window.confirm(`确定要删除字典项 "${item.itemLabel}" 吗？`)) return;
    try {
      await http.delete(`/business/dict/item/${item.itemId}`);
      showMessage('删除成功');
      loadItems();
    } catch (err: any) {
      showMessage(err?.message || '删除失败', 'error');
    }
  };

  const handleItemSubmit = async () => {
    try {
      if (editingItem) {
        await http.put('/business/dict/item', { itemId: editingItem.itemId, ...itemForm });
        showMessage('修改成功');
      } else {
        await http.post('/business/dict/item', { dictId: selectedDict!.dictId, ...itemForm });
        showMessage('新增成功');
      }
      setItemDialogOpen(false);
      loadItems();
    } catch (err: any) {
      showMessage(err?.message || '操作失败', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>数据字典</Typography>
          <Typography variant="body2" color="text.secondary">管理系统字典类型和字典项配置</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadDicts}>刷新</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddType}>新增字典类型</Button>
        </Box>
      </Box>

      {/* 搜索栏 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small" placeholder="搜索字典名称"
              value={searchDictName} onChange={(e) => setSearchDictName(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              sx={{ minWidth: 200 }}
            />
            <TextField
              size="small" placeholder="搜索字典类型"
              value={searchDictType} onChange={(e) => setSearchDictType(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <Button variant="contained" onClick={() => setDictPagination({ ...dictPagination, page: 0 })}>搜索</Button>
            <Button variant="outlined" onClick={() => { setSearchDictName(''); setSearchDictType(''); }}>重置</Button>
          </Box>
        </CardContent>
      </Card>

      {/* 选项卡 */}
      <Card sx={{ mb: 0 }}>
        <CardContent sx={{ pb: 0 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="字典类型" icon={<DescriptionIcon />} iconPosition="start" />
            <Tab
              label={`字典项${selectedDict ? ` (${selectedDict.dictName})` : ''}`}
              icon={<DescriptionIcon />} iconPosition="start"
              disabled={!selectedDict}
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* 字典类型面板 */}
      {tabValue === 0 && (
        <Card sx={{ mt: 0, borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
          <CardContent sx={{ p: 0 }}>
            <DataGrid
              rows={dictGridRows} columns={typeColumns} loading={dictLoading}
              rowCount={dictTotal} paginationMode="server"
              paginationModel={dictPagination} onPaginationModelChange={setDictPagination}
              onRowClick={(params) => setSelectedDict(params.row)}
              disableRowSelectionOnClick autoHeight pageSizeOptions={[10, 20, 50]}
              sx={{ border: 'none', '& .MuiDataGrid-cell': { border: 'none' }, '& .MuiDataGrid-columnHeaders': { backgroundColor: 'action.hover' } }}
            />
          </CardContent>
        </Card>
      )}

      {/* 字典项面板 */}
      {tabValue === 1 && selectedDict && (
        <Card sx={{ mt: 0, borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
          <CardContent>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>{selectedDict.dictName} - 字典项列表</Typography>
                <Typography variant="body2" color="text.secondary">字典类型：{selectedDict.dictType}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" size="small" onClick={() => setTabValue(0)}>返回字典类型</Button>
                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleAddItem}>新增字典项</Button>
              </Box>
            </Box>
            <DataGrid
              rows={itemGridRows} columns={itemColumns} loading={itemLoading}
              rowCount={itemTotal} paginationMode="server"
              paginationModel={itemPagination} onPaginationModelChange={setItemPagination}
              disableRowSelectionOnClick autoHeight pageSizeOptions={[10, 20, 50]}
              sx={{ border: 'none', '& .MuiDataGrid-cell': { border: 'none' }, '& .MuiDataGrid-columnHeaders': { backgroundColor: 'action.hover' } }}
            />
          </CardContent>
        </Card>
      )}

      {/* 字典类型对话框 */}
      <Dialog open={typeDialogOpen} onClose={() => setTypeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingType ? '编辑字典类型' : '新增字典类型'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="字典名称" value={typeForm.dictName}
              onChange={(e) => setTypeForm({ ...typeForm, dictName: e.target.value })} fullWidth required />
            <TextField label="字典类型" value={typeForm.dictType}
              onChange={(e) => setTypeForm({ ...typeForm, dictType: e.target.value })}
              disabled={!!editingType} fullWidth required placeholder="例如：gender, status" />
            <TextField label="备注" value={typeForm.remark}
              onChange={(e) => setTypeForm({ ...typeForm, remark: e.target.value })} fullWidth multiline rows={2} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTypeDialogOpen(false)}>取消</Button>
          <Button onClick={handleTypeSubmit} variant="contained">确定</Button>
        </DialogActions>
      </Dialog>

      {/* 字典项对话框 */}
      <Dialog open={itemDialogOpen} onClose={() => setItemDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? '编辑字典项' : '新增字典项'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="字典标签" value={itemForm.itemLabel}
              onChange={(e) => setItemForm({ ...itemForm, itemLabel: e.target.value })} fullWidth required placeholder="例如：男" />
            <TextField label="字典值" value={itemForm.itemValue}
              onChange={(e) => setItemForm({ ...itemForm, itemValue: e.target.value })} fullWidth required placeholder="例如：1" />
            <TextField label="排序" type="number" value={itemForm.sortOrder}
              onChange={(e) => setItemForm({ ...itemForm, sortOrder: Number(e.target.value) })} fullWidth />
            <FormControlLabel
              control={<Switch checked={itemForm.status === 1}
                onChange={(e) => setItemForm({ ...itemForm, status: e.target.checked ? 1 : 0 })} />}
              label="启用"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialogOpen(false)}>取消</Button>
          <Button onClick={handleItemSubmit} variant="contained">确定</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DictList;
