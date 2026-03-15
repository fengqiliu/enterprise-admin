import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Collapse,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Assessment as AssessmentIcon,
  FolderShared as FolderSharedIcon,
} from '@mui/icons-material';
import { useSidebarStore } from '@stores';
import { useNavigate, useLocation } from 'react-router-dom';

// 菜单项配置
interface MenuItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    title: '仪表盘',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    key: 'system',
    title: '系统管理',
    icon: <SettingsIcon />,
    children: [
      {
        key: 'user',
        title: '用户管理',
        icon: <PeopleIcon />,
        path: '/system/user',
      },
      {
        key: 'role',
        title: '角色管理',
        icon: <SecurityIcon />,
        path: '/system/role',
      },
      {
        key: 'menu',
        title: '菜单管理',
        icon: <AssignmentIcon />,
        path: '/system/menu',
      },
      {
        key: 'department',
        title: '部门管理',
        icon: <FolderSharedIcon />,
        path: '/system/department',
      },
    ],
  },
  {
    key: 'business',
    title: '业务管理',
    icon: <AssignmentIcon />,
    children: [
      {
        key: 'dict',
        title: '数据字典',
        icon: <DescriptionIcon />,
        path: '/business/dict',
      },
      {
        key: 'config',
        title: '参数配置',
        icon: <StorageIcon />,
        path: '/business/config',
      },
    ],
  },
  {
    key: 'log',
    title: '日志中心',
    icon: <HistoryIcon />,
    children: [
      {
        key: 'operation',
        title: '操作日志',
        icon: <AssignmentIcon />,
        path: '/log/operation',
      },
      {
        key: 'login',
        title: '登录日志',
        icon: <SecurityIcon />,
        path: '/log/login',
      },
    ],
  },
  {
    key: 'report',
    title: '报表中心',
    icon: <AssessmentIcon />,
    path: '/report',
  },
];

interface AppSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  mobileOpen,
  onMobileClose,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggleCollapsed } = useSidebarStore();
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({
    system: true,
  });

  const drawerWidth = collapsed ? 64 : 260;

  const handleToggleCollapse = () => {
    toggleCollapsed();
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      setOpenMenus((prev) => ({
        ...prev,
        [item.key]: !prev[item.key],
      }));
    } else if (item.path) {
      navigate(item.path);
      onMobileClose();
    }
  };

  const isSelected = (item: MenuItem) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    return item.children?.some((child) => location.pathname === child.path);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.key];
    const selected = isSelected(item);

    return (
      <React.Fragment key={item.key}>
        <ListItem
          disablePadding
          sx={{
            display: 'block',
            pl: level > 0 ? 3 : 0,
          }}
        >
          <ListItemButton
            selected={selected}
            onClick={() => handleMenuClick(item)}
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: 2.5,
              borderRadius: 2,
              mx: collapsed ? 1 : 2,
              my: 0.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 2,
                justifyContent: 'center',
                color: selected ? 'primary.main' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: selected ? 600 : 400,
                  fontSize: '0.9rem',
                }}
              />
            )}
            {!collapsed && hasChildren && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && !collapsed && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo 区域 */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        {!collapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            企业后台
          </Typography>
        )}
        <Tooltip title={collapsed ? '展开' : '收起'} placement="right">
          <IconButton
            onClick={handleToggleCollapse}
            sx={{
              position: 'absolute',
              right: collapsed ? 8 : -12,
              top: 20,
              bgcolor: 'background.paper',
              boxShadow: 1,
              width: 24,
              height: 24,
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              },
            }}
          >
            {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* 菜单列表 */}
      <List sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        {menuItems.map((item) => renderMenuItem(item))}
      </List>

      <Divider />

      {/* 底部信息 */}
      {!collapsed && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            v1.0.0
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* 桌面端侧边栏 */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* 移动端侧边栏 */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      </Box>
    </>
  );
};

export default AppSidebar;