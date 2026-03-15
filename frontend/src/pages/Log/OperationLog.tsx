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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { InputAdornment } from '@mui/material';
import dayjs from 'dayjs';

// 操作日志数据
interface OperationLog {
  id: number;
  userId: number;
  username: string;
  operation: string;
  method: string;
  params: string;
  ip: string;
  time: number;
  createTime: string;
  status: 'success' | 'error';
}

// 模拟操作日志数据
const initialOperationLogs: OperationLog[] = [
  { id: 1, userId: 1, username: 'admin', operation: '新增用户', method: 'POST /api/system/user', params: '{"username":"test","nickname":"测试用户"}', ip: '192.168.1.100', time: 125, createTime: '2024-01-15 10:30:00', status: 'success' },
  { id: 2, userId: 1, username: 'admin', operation: '修改用户', method: 'PUT /api/system/user', params: '{"userId":2,"nickname":"张三"}', ip: '192.168.1.100', time: 98, createTime: '2024-01-15 10:25:00', status: 'success' },
  { id: 3, userId: 2, username: 'zhangsan', operation: '删除用户', method: 'DELETE /api/system/user/3', params: '', ip: '192.168.1.101', time: 156, createTime: '2024-01-15 10:20:00', status: 'success' },
  { id: 4, userId: 1, username: 'admin', operation: '查询用户列表', method: 'GET /api/system/user/list', params: 'current=1&size=10', ip: '192.168.1.100', time: 45, createTime: '2024-01-15 10:15:00', status: 'success' },
  { id: 5, userId: 3, username: 'lisi', operation: '重置密码', method: 'PUT /api/system/user/4/password', params: '{"password":"***"}', ip: '192.168.1.102', time: 89, createTime: '2024-01-15 10:10:00', status: 'error' },
  { id: 6, userId: 1, username: 'admin', operation: '新增角色', method: 'POST /api/system/role', params: '{"roleName":"测试角色","roleCode":"test"}', ip: '192.168.1.100', time: 112, createTime: '2024-01-15 10:05:00', status: 'success' },
  { id: 7, userId: 2, username: 'zhangsan', operation: '分配权限', method: 'POST /api/system/role/permission', params: '{"roleId":2,"permissions":["system:*"]}', ip: '192.168.1.101', time: 178, createTime: '2024-01-15 10:00:00', status: 'success' },
  { id: 8, userId: 1, username: 'admin', operation: '导出用户', method: 'POST /api/system/user/export', params: '{"ids":[1,2,3]}', ip: '192.168.1.100', time: 2345, createTime: '2024-01-15 09:55:00', status: 'success' },
];

export const OperationLog: React.FC = () => {
  const [logs, setLogs] = useState<OperationLog[]>(initialOperationLogs);
  const [searchText, setSearchText] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<OperationLog | null>(null);

  // 表格列定义
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: '操作人', width: 120 },
    { field: 'operation', headerName: '操作模块', width: 150 },
    { field: 'method', headerName: '请求方法', width: 180 },
    { field: 'ip', headerName: 'IP 地址', width: 140 },
    {
      field: 'time',
      headerName: '执行时长 (ms)',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={`${params.value}ms`}
          color={params.value < 100 ? 'success' : params.value < 500 ? 'warning' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: '状态',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value === 'success' ? '成功' : '失败'}
          color={params.value === 'success' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'createTime',
      headerName: '操作时间',
      width: 160,
      valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 100,
      renderCell: (params) => (
        <IconButton size="small" color="primary" onClick={() => handleView(params.row)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const handleView = (log: OperationLog) => {
    setSelectedLog(log);
    setDetailDialogOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedRows.length} 条记录吗？`)) {
      setLogs(logs.filter((log) => !selectedRows.includes(log.id)));
      setSelectedRows([]);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.username.toLowerCase().includes(searchText.toLowerCase()) ||
      log.operation.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box>
      {/* 页面标题 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            操作日志
          </Typography>
          <Typography variant="body2" color="text.secondary">
            记录系统用户的所有操作行为
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            导出
          </Button>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setLogs(initialOperationLogs)}>
            刷新
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0}
          >
            批量删除
          </Button>
        </Box>
      </Box>

      {/* 搜索栏 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="搜索操作人/操作模块"
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
                <MenuItem value="success">成功</MenuItem>
                <MenuItem value="error">失败</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>时间范围</InputLabel>
              <Select label="时间范围" defaultValue="">
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="today">今天</MenuItem>
                <MenuItem value="week">本周</MenuItem>
                <MenuItem value="month">本月</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* 数据表格 */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={filteredLogs}
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
              '& .MuiDataGrid-cell': { border: 'none' },
              '& .MuiDataGrid-columnHeaders': { backgroundColor: 'action.hover' },
            }}
          />
        </CardContent>
      </Card>

      {/* 详情对话框 */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>操作日志详情</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: 120 }}>日志 ID</TableCell>
                    <TableCell>{selectedLog.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>操作人</TableCell>
                    <TableCell>{selectedLog.username} (ID: {selectedLog.userId})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>操作模块</TableCell>
                    <TableCell>{selectedLog.operation}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>请求方法</TableCell>
                    <TableCell>{selectedLog.method}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>请求参数</TableCell>
                    <TableCell>
                      <Box
                        component="pre"
                        sx={{
                          bgcolor: 'grey.100',
                          p: 1,
                          borderRadius: 1,
                          overflow: 'auto',
                          maxWidth: '100%',
                        }}
                      >
                        {selectedLog.params || '无'}
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>IP 地址</TableCell>
                    <TableCell>{selectedLog.ip}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>执行时长</TableCell>
                    <TableCell>
                      <Chip
                        label={`${selectedLog.time}ms`}
                        color={selectedLog.time < 100 ? 'success' : selectedLog.time < 500 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>状态</TableCell>
                    <TableCell>
                      <Chip
                        label={selectedLog.status === 'success' ? '成功' : '失败'}
                        color={selectedLog.status === 'success' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>操作时间</TableCell>
                    <TableCell>{selectedLog.createTime}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OperationLog;
