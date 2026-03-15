import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  MoreHoriz as MoreHorizIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
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
} from 'recharts';

// 统计数据卡片
interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
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
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: `${color}20`,
              color: color,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

// 模拟数据
const lineData = [
  { name: '1 月', 收入: 4000, 支出: 2400 },
  { name: '2 月', 收入: 3000, 支出: 1398 },
  { name: '3 月', 收入: 5000, 支出: 3800 },
  { name: '4 月', 收入: 4780, 支出: 3908 },
  { name: '5 月', 收入: 5890, 支出: 4800 },
  { name: '6 月', 收入: 6390, 支出: 3800 },
  { name: '7 月', 收入: 7490, 支出: 4300 },
];

const barData = [
  { name: '周一', 访问量: 2400, 订单: 1400 },
  { name: '周二', 访问量: 1398, 订单: 2210 },
  { name: '周三', 访问量: 9800, 订单: 2290 },
  { name: '周四', 访问量: 3908, 订单: 2000 },
  { name: '周五', 访问量: 4800, 订单: 2181 },
  { name: '周六', 访问量: 3800, 订单: 2500 },
  { name: '周日', 访问量: 4300, 订单: 2100 },
];

const pieData = [
  { name: '电子产品', value: 400 },
  { name: '服装', value: 300 },
  { name: '家居', value: 300 },
  { name: '图书', value: 200 },
];

const COLORS = ['#1976d2', '#9c27b0', '#2e7d32', '#ed6c02'];

const recentOrders = [
  { id: 'ORD001', customer: '张三', product: 'MacBook Pro', amount: 14999, status: 'completed', date: '2024-01-15' },
  { id: 'ORD002', customer: '李四', product: 'iPhone 15 Pro', amount: 8999, status: 'pending', date: '2024-01-15' },
  { id: 'ORD003', customer: '王五', product: 'AirPods Pro', amount: 1899, status: 'processing', date: '2024-01-14' },
  { id: 'ORD004', customer: '赵六', product: 'iPad Air', amount: 4799, status: 'completed', date: '2024-01-14' },
  { id: 'ORD005', customer: '钱七', product: 'Apple Watch', amount: 3199, status: 'cancelled', date: '2024-01-13' },
];

const getStatusChip = (status: string) => {
  const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'error' }> = {
    completed: { label: '已完成', color: 'success' },
    pending: { label: '待处理', color: 'warning' },
    processing: { label: '处理中', color: 'info' },
    cancelled: { label: '已取消', color: 'error' },
  };
  const { label, color } = statusMap[status] || { label: status, color: 'info' };
  return <Chip label={label} color={color} size="small" />;
};

export const Dashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* 页面标题 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          欢迎回来，管理员
        </Typography>
        <Typography variant="body2" color="text.secondary">
          今天是 2024 年 1 月 15 日，祝您工作愉快！
        </Typography>
      </Box>

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} lg={3}>
          <StatCard
            title="总用户数"
            value="12,846"
            change={12.5}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <StatCard
            title="总订单数"
            value="8,254"
            change={8.2}
            icon={<ShoppingCartIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <StatCard
            title="总收入"
            value="¥1,245,678"
            change={15.3}
            icon={<MoneyIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <StatCard
            title="待处理任务"
            value="42"
            change={-5.4}
            icon={<AssignmentIcon />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      {/* 图表区域 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* 收入趋势图 */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  收入趋势
                </Typography>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={lineData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="收入"
                    stroke={theme.palette.primary.main}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="支出"
                    stroke={theme.palette.error.main}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 销售分布 */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  销售分布
                </Typography>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill={theme.palette.primary.main}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 底部区域 */}
      <Grid container spacing={3}>
        {/* 周访问量统计 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  周访问量统计
                </Typography>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="访问量" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="订单" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 最近订单 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  最近订单
                </Typography>
                <Chip label="查看全部" size="small" clickable />
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>订单号</TableCell>
                      <TableCell>客户</TableCell>
                      <TableCell>金额</TableCell>
                      <TableCell>状态</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>¥{order.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusChip(order.status)}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;