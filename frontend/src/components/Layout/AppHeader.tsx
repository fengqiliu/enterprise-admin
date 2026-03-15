import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useThemeStore, useUserStore } from '@stores';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeStore();
  const { user, logout } = useUserStore();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] =
    React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenNotifications = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        {/* 左侧菜单按钮 */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          企业后台管理系统
        </Typography>

        {/* 搜索框 - 隐藏在小屏幕 */}
        <Box
          sx={{
            flex: 1,
            mx: 3,
            maxWidth: 600,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme.palette.action.hover,
              borderRadius: 8,
              px: 2,
              py: 1,
            }}
          >
            <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
            <input
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                flex: 1,
                color: theme.palette.text.primary,
              }}
              placeholder="搜索..."
            />
          </Box>
        </Box>

        {/* 右侧操作区 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 全屏切换 */}
          <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
            <IconButton
              color="inherit"
              onClick={toggleFullscreen}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>

          {/* 主题切换 */}
          <Tooltip title={mode === 'light' ? '深色模式' : '浅色模式'}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* 通知 */}
          <Tooltip title="通知">
            <IconButton color="inherit" onClick={handleOpenNotifications}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* 用户菜单 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={handleOpenUserMenu}
          >
            <Avatar
              src={user?.avatar}
              sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main }}
            >
              {user?.nickname?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, lineHeight: 1.2 }}
              >
                {user?.nickname || '用户'}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, lineHeight: 1.2 }}
              >
                {user?.roles?.[0] || '普通用户'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>

      {/* 用户下拉菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseUserMenu}
        PaperProps={{
          sx: {
            minWidth: 200,
            borderRadius: 2,
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {}}>
          <PersonIcon sx={{ mr: 1 }} />
          个人中心
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <SettingsIcon sx={{ mr: 1 }} />
          设置
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <LogoutIcon sx={{ mr: 1 }} />
          退出登录
        </MenuItem>
      </Menu>

      {/* 通知下拉菜单 */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleCloseNotifications}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400,
            borderRadius: 2,
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            通知中心
          </Typography>
        </Box>
        <Divider />
        {[1, 2, 3].map((item) => (
          <MenuItem key={item} sx={{ py: 1.5, px: 2 }}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                系统通知 {item}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item} 小时前
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={handleCloseNotifications}
          sx={{
            justifyContent: 'center',
            py: 1,
            color: 'primary.main',
          }}
        >
          查看全部
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default AppHeader;