import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import dayjs from 'dayjs';
import { http } from '@/services/api';

// 统计数据接口
interface StatData {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

// 报表数据类型
interface ReportData {
  id: number;
  name: string;
  type: string;
  typeValue?: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  statusValue?: number;
  createTime: string;
  downloadCount: number;
  fileSize?: string;
  createByName?: string;
}

// 报表类型选项
interface ReportTypeOption {
  value: string;
  label: string;
}

// 生成报告表单数据
interface GenerateReportForm {
  reportName: string;
  reportType: string;
  description: string;
  startDate: string;
  endDate: string;
  remark: string;
}

// 模拟统计数据
const statCards: StatData[] = [
  {
    title: '总用户数',
    value: '12,846',
    change: 12.5,
    icon: <PeopleIcon />,
    color: '#1976d2',
  },
  {
    title: '总订单数',
    value: '8,254',
    change: 8.2,
    icon: <ShoppingCartIcon />,
    color: '#2e7d32',
  },
  {
    title: '总收入',
    value: '¥1,245,678',
    change: 15.3,
    icon: <MoneyIcon />,
    color: '#ed6c02',
  },
  {
    title: '待处理任务',
    value: '42',
    change: -5.4,
    icon: <AssignmentIcon />,
    color: '#d32f2f',
  },
];

// 模拟月度趋势数据
const monthlyTrendData = [
  { month: '1 月', income: 4000, expense: 2400, profit: 1600 },
  { month: '2 月', income: 3000, expense: 1398, profit: 1602 },
  { month: '3 月', income: 5000, expense: 3800, profit: 1200 },
  { month: '4 月', income: 4780, expense: 3908, profit: 872 },
  { month: '5 月', income: 5890, expense: 4800, profit: 1090 },
  { month: '6 月', income: 6390, expense: 3800, profit: 2590 },
  { month: '7 月', income: 7490, expense: 4300, profit: 3190 },
  { month: '8 月', income: 8200, expense: 4500, profit: 3700 },
  { month: '9 月', income: 7800, expense: 4200, profit: 3600 },
  { month: '10 月', income: 8500, expense: 4600, profit: 3900 },
  { month: '11 月', income: 9200, expense: 4800, profit: 4400 },
  { month: '12 月', income: 10500, expense: 5200, profit: 5300 },
];

// 模拟部门业绩数据
const departmentData = [
  { name: '技术部', performance: 400, staff: 25 },
  { name: '市场部', performance: 300, staff: 15 },
  { name: '销售部', performance: 500, staff: 30 },
  { name: '财务部', performance: 200, staff: 10 },
  { name: '人力资源部', performance: 150, staff: 8 },
];

// 模拟产品分类销售数据
const productCategoryData = [
  { name: '电子产品', value: 400 },
  { name: '服装服饰', value: 300 },
  { name: '家居用品', value: 300 },
  { name: '图书音像', value: 200 },
  { name: '运动户外', value: 150 },
];

const COLORS = ['#1976d2', '#9c27b0', '#2e7d32', '#ed6c02', '#00bcd4'];

// 模拟报表列表数据

// 统计卡片组件
const StatCard: React.FC<StatData> = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isPositive ? (
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography
                variant="body2"
                sx={{ color: isPositive ? 'success.main' : 'error.main' }}
              >
                {isPositive ? '+' : ''}{change}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                较上月
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${color}20`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
};

// 状态标签组件
const getStatusChip = (status: number | string) => {
  const statusMap: Record<number, { label: string; color: 'success' | 'warning' | 'info' | 'error' }> = {
    0: { label: '待生成', color: 'warning' },
    1: { label: '生成中', color: 'info' },
    2: { label: '已完成', color: 'success' },
    3: { label: '失败', color: 'error' },
  };
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  const { label, color } = statusMap[statusNum] || { label: '未知', color: 'default' as any };
  return <Chip label={label} color={color} size="small" />;
};

export const Report: React.FC = () => {
  const [reportType, setReportType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('month');
  const [reports, setReports] = useState<ReportData[]>([]);
  const [reportTypes, setReportTypes] = useState<ReportTypeOption[]>([]);

  // 对话框状态
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // 表单状态
  const [formData, setFormData] = useState<GenerateReportForm>({
    reportName: '',
    reportType: 'sales',
    description: '',
    startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    remark: '',
  });

  // 加载报表类型
  useEffect(() => {
    loadReportTypes();
    loadReports();
  }, [reportType]);

  // 加载报表类型
  const loadReportTypes = async () => {
    try {
      const response = await http.get('/report/types');
      if (response.code === 200) {
        setReportTypes(response.data || []);
      }
    } catch (error) {
      console.error('加载报表类型失败:', error);
      // 使用默认类型
      setReportTypes([
        { value: 'sales', label: '销售报表' },
        { value: 'finance', label: '财务报表' },
        { value: 'user', label: '用户分析' },
        { value: 'performance', label: '绩效报表' },
        { value: 'inventory', label: '库存报表' },
      ]);
    }
  };

  // 加载报表列表
  const loadReports = async () => {
    try {
      const response = await http.get('/report/page', {
        params: {
          current: 1,
          size: 50,
          reportType: reportType === 'all' ? '' : reportType,
        },
      });
      if (response.code === 200 && response.data) {
        setReports(
          response.data.records.map((item: any) => ({
            id: item.reportId,
            name: item.reportName,
            type: item.reportType,
            status: item.status === 2 ? 'completed' : item.status === 1 ? 'processing' : item.status === 0 ? 'pending' : 'failed',
            statusValue: item.status,
            createTime: item.createTime,
            downloadCount: item.downloadCount,
            fileSize: item.fileSizeFormatted,
            createByName: item.createByName,
          }))
        );
      }
    } catch (error) {
      console.error('加载报表列表失败:', error);
    }
  };

  // 处理报表类型变化
  const handleReportTypeChange = (event: SelectChangeEvent) => {
    setReportType(event.target.value);
  };

  // 处理日期范围变化
  const handleDateRangeChange = (event: SelectChangeEvent) => {
    setDateRange(event.target.value);
  };

  // 处理刷新
  const handleRefresh = () => {
    loadReports();
  };

  // 打开生成报告对话框
  const handleOpenDialog = () => {
    setFormData({
      reportName: '',
      reportType: 'sales',
      description: '',
      startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
      remark: '',
    });
    setDialogOpen(true);
  };

  // 关闭对话框
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // 生成报告
  const handleGenerate = async () => {
    if (!formData.reportName) {
      setSnackbar({ open: true, message: '请输入报表名称', severity: 'error' });
      return;
    }

    setDialogLoading(true);
    try {
      const response = await http.post('/report/generate', {
        reportName: formData.reportName,
        reportType: formData.reportType,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        remark: formData.remark,
      });

      if (response.code === 200) {
        setDialogLoading(false);
        setDialogOpen(false);
        setSnackbar({ open: true, message: '报表生成任务已提交，请稍后查看', severity: 'success' });
        loadReports();
      }
    } catch (error: any) {
      setDialogLoading(false);
      setSnackbar({
        open: true,
        message: error.message || '生成报表失败',
        severity: 'error',
      });
    }
  };

  // 处理导出
  const handleExport = async (report: ReportData) => {
    try {
      window.open(`/api/report/download/${report.id}`, '_blank');
      setSnackbar({ open: true, message: '开始下载报表', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: '下载失败', severity: 'error' });
    }
  };

  // 处理删除
  const handleDelete = async (report: ReportData) => {
    if (window.confirm(`确定要删除报表 "${report.name}" 吗？`)) {
      try {
        await http.delete(`/report/${report.id}`);
        setSnackbar({ open: true, message: '删除成功', severity: 'success' });
        loadReports();
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error.message || '删除失败',
          severity: 'error',
        });
      }
    }
  };

  // 关闭 Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 过滤报表列表
  const filteredReports = reportType === 'all'
    ? reports
    : reports.filter((r: ReportData) => r.type === reportType);

  return (
    <Box>
      {/* 页面标题 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            报表中心
          </Typography>
          <Typography variant="body2" color="text.secondary">
            查看和下载各类统计报表，包括销售、财务、用户分析等
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
            刷新
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            批量导出
          </Button>
        </Box>
      </Box>

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* 筛选条件 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                筛选条件：
              </Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>报表类型</InputLabel>
              <Select
                value={reportType}
                label="报表类型"
                onChange={handleReportTypeChange}
              >
                <MenuItem value="all">全部类型</MenuItem>
                <MenuItem value="销售报表">销售报表</MenuItem>
                <MenuItem value="财务报表">财务报表</MenuItem>
                <MenuItem value="用户分析">用户分析</MenuItem>
                <MenuItem value="绩效报表">绩效报表</MenuItem>
                <MenuItem value="库存报表">库存报表</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>日期范围</InputLabel>
              <Select
                value={dateRange}
                label="日期范围"
                onChange={handleDateRangeChange}
              >
                <MenuItem value="week">最近 7 天</MenuItem>
                <MenuItem value="month">最近 30 天</MenuItem>
                <MenuItem value="quarter">最近 90 天</MenuItem>
                <MenuItem value="year">最近 1 年</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* 图表区域 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* 月度收入趋势 */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  月度收支趋势
                </Typography>
                <Chip label={dateRange === 'month' ? '本月' : '本年度'} size="small" />
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrendData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#1976d2"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#2e7d32"
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 销售分布饼图 */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  产品分类销售分布
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productCategoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 部门业绩柱状图 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  部门业绩对比
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="performance" fill="#1976d2" radius={[4, 4, 0, 0]} name="业绩" />
                  <Bar dataKey="staff" fill="#9c27b0" radius={[4, 4, 0, 0]} name="人数" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 周访问量统计 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  周访问量统计
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[
                  { day: '周一', uv: 4000, pv: 2400 },
                  { day: '周二', uv: 3000, pv: 1398 },
                  { day: '周三', uv: 9800, pv: 3800 },
                  { day: '周四', uv: 3908, pv: 3908 },
                  { day: '周五', uv: 4800, pv: 4800 },
                  { day: '周六', uv: 3800, pv: 3800 },
                  { day: '周日', uv: 4300, pv: 4300 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="uv" stroke="#1976d2" name="访问量" strokeWidth={2} />
                  <Line type="monotone" dataKey="pv" stroke="#2e7d32" name="页面浏览" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 报表列表 */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              可用报表
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
              生成报表
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            共 {filteredReports.length} 条记录
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>报表名称</TableCell>
                  <TableCell>类型</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>创建时间</TableCell>
                  <TableCell>下载次数</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow
                    key={report.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {report.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{getStatusChip(report.status)}</TableCell>
                    <TableCell>{dayjs(report.createTime).format('YYYY-MM-DD')}</TableCell>
                    <TableCell>{report.downloadCount}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleExport(report)}
                        disabled={report.status !== 'completed'}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(report)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 生成报表对话框 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>生成报表</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="报表名称"
                value={formData.reportName}
                onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
                placeholder="请输入报表名称"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>报表类型</InputLabel>
                <Select
                  value={formData.reportType}
                  label="报表类型"
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                >
                  {reportTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="描述"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请输入报表描述"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="开始日期"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="结束日期"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="备注"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                placeholder="请输入备注信息"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} disabled={dialogLoading}>
            取消
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={dialogLoading || !formData.reportName}
          >
            {dialogLoading ? <CircularProgress size={24} /> : '生成报表'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar 提示 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Report;
