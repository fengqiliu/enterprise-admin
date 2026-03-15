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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Login as LoginIcon,
  Public as PublicIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';

// 登录日志数据
interface LoginLog {
  id: number;
  userId: number;
  username: string;
  ip: string;
  location: string;
  browser: string;
  os: string;
  status: 'success' | 'error';
  message: string;
  createTime: string;
}

// 模拟数据
const initialLoginLogs: LoginLog[] = [
  { id: 1, userId: 1, username: 'admin', ip: '192.168.1.100', location: '广东省深圳市', browser: 'Chrome 120.0', os: 'Windows 10', status: 'success', message: '登录成功', createTime: '2024-01-15 09:00:00' },
  { id: 2, userId: 2, username: 'zhangsan', ip: '192.168.1.101', location: '北京市', browser: 'Firefox 121.0', os: 'macOS 14', status: 'success', message: '登录成功', createTime: '2024-01-15 08:55:00' },
  { id: 3, userId: 3, username: 'lisi', ip: '192.168.1.102', location: '上海市', browser: 'Safari 17.2', os: 'iOS 17', status: 'error', message: '密码错误', createTime: '2024-01-15 08:50:00' },
  { id: 4, userId: 1, username: 'admin', ip: '192.168.1.100', location: '广东省深圳市', browser: 'Chrome 120.0', os: 'Windows 10', status: 'success', message: '登录成功', createTime: '2024-01-14 18:30:00' },
  { id: 5, userId: 4, username: 'wangwu', ip: '192.168.1.103', location: '浙江省杭州市', browser: 'Edge 120.0', os: 'Windows 11', status: 'success', message: '登录成功', createTime: '2024-01-14 17:45:00' },
  { id: 6, userId: 5, username: 'unknown', ip: '192.168.1.200', location: '未知', browser: 'Chrome 120.0', os: 'Windows 10', status: 'error', message: '用户不存在', createTime: '2024-01-14 17:30:00' },
  { id: 7, userId: 2, username: 'zhangsan', ip: '192.168.1.101', location: '北京市', browser: 'Firefox 121.0', os: 'macOS 14', status: 'success', message: '登录成功', createTime: '2024-01-14 09:00:00' },
  { id: 8, userId: 6, username: 'zhaoliu', ip: '192.168.1.104', location: '四川省成都市', browser: 'Chrome 120.0', os: 'Android 14', status: 'success', message: '登录成功', createTime: '2024-01-14 08:30:00' },
  { id: 9, userId: 1, username: 'admin', ip: '192.168.1.100', location: '广东省深圳市', browser: 'Chrome 120.0', os: 'Windows 10', status: 'error', message: '验证码错误', createTime: '2024-01-13 22:15:00' },
  { id: 10, userId: 7, username: 'sunqi', ip: '192.168.1.105', location: '湖北省武汉市', browser: 'Edge 120.0', os: 'Windows 11', status: 'success', message: '登录成功', createTime: '2024-01-13 18:00:00' },
];

export const LoginLog: React.FC = () => {
  const [logs, setLogs] = useState<LoginLog[]>(initialLoginLogs);
  const [searchText, setSearchText] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LoginLog | null>(null);

  // 表格列定义
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: '用户名', flex: 1, minWidth: 100 },
    { field: 'ip', headerName: 'IP 地址', width: 130 },
    { field: 'location', headerName: '登录地点', flex: 1, minWidth: 120 },
    { field: 'browser', headerName: '浏览器', flex: 1, minWidth: 120 },
    { field: 'os', headerName: '操作系统', flex: 1, minWidth: 100 },
    {
      field: 'status',
      headerName: '状态',
      width: 80,
      renderCell: (params) => (
        <Chip
          label={params.value === 'success' ? '成功' : '失败'}
          color={params.value === 'success' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'message',
      headerName: '提示信息',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'createTime',
      headerName: '登录时间',
      width: 160,
      valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 80,
      renderCell: (params) => (
        <IconButton size="small" color="primary" onClick={() => handleView(params.row)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const handleView = (log: LoginLog) => {
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
      log.ip.includes(searchText) ||
      log.location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box>
      {/* 页面标题 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            登录日志
          </Typography>
          <Typography variant="body2" color="text.secondary">
            记录系统用户的所有登录行为
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            导出
          </Button>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setLogs(initialLoginLogs)}>
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
              placeholder="搜索用户名/IP 地址/登录地点"
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
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LoginIcon />
            登录日志详情
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: 100 }}>日志 ID</TableCell>
                    <TableCell>{selectedLog.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>用户名</TableCell>
                    <TableCell>
                      {selectedLog.username}
                      {selectedLog.userId && <Chip label={`ID: ${selectedLog.userId}`} size="small" sx={{ ml: 1 }} />}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>IP 地址</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PublicIcon fontSize="small" color="action" />
                        {selectedLog.ip}
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>登录地点</TableCell>
                    <TableCell>{selectedLog.location}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>浏览器</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ComputerIcon fontSize="small" color="action" />
                        {selectedLog.browser}
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>操作系统</TableCell>
                    <TableCell>{selectedLog.os}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>登录状态</TableCell>
                    <TableCell>
                      <Chip
                        label={selectedLog.status === 'success' ? '成功' : '失败'}
                        color={selectedLog.status === 'success' ? 'success' : 'error'}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>提示信息</TableCell>
                    <TableCell>{selectedLog.message}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>登录时间</TableCell>
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

export default LoginLog;
