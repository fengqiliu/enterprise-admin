import React from 'react';
import { Box, CssBaseline, useTheme } from '@mui/material';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { useTabsStore, useSidebarStore } from '@stores';
import { Tabs, Tab } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useTheme();
  const { collapsed } = useSidebarStore();
  const { tabs, activeTab, addTab, removeTab, setActiveTab } = useTabsStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // 自动添加标签页
  React.useEffect(() => {
    const pageTitle = getPageTitle(location.pathname);
    if (pageTitle && !tabs.find((t: { key: string; title: string; path: string }) => t.path === location.pathname)) {
      addTab({
        key: location.pathname,
        title: pageTitle,
        path: location.pathname,
      });
    }
    if (!activeTab) {
      setActiveTab(location.pathname);
    }
  }, [location.pathname]);

  // 同步 activeTab 与 location
  React.useEffect(() => {
    if (activeTab !== location.pathname && activeTab) {
      navigate(activeTab);
    }
  }, [activeTab]);

  const getPageTitle = (path: string): string => {
    const titles: Record<string, string> = {
      '/dashboard': '仪表盘',
      '/system/user': '用户管理',
      '/system/role': '角色管理',
      '/system/menu': '菜单管理',
      '/system/department': '部门管理',
      '/business/dict': '数据字典',
      '/business/config': '参数配置',
      '/log/operation': '操作日志',
      '/log/login': '登录日志',
      '/report': '报表中心',
    };
    return titles[path] || '';
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleCloseTab = (
    event: React.MouseEvent<SVGSVGElement>,
    key: string
  ) => {
    event.stopPropagation();
    removeTab(key);
  };

  const drawerWidth = collapsed ? 64 : 260;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* 顶部导航 */}
      <AppHeader onMenuClick={() => setMobileOpen(!mobileOpen)} />
      
      {/* 侧边栏 */}
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      
      {/* 主内容区 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { sm: `${drawerWidth}px` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 标签页导航 */}
        {tabs.length > 0 && (
          <Box
            sx={{
              bgcolor: theme.palette.background.paper,
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
            }}
          >
            <Tabs
              value={activeTab || location.pathname}
              onChange={handleTabChange}
              sx={{
                minHeight: 46,
                '& .MuiTab-root': {
                  minHeight: 46,
                  textTransform: 'none',
                },
              }}
            >
              {tabs.map((tab: { key: string; title: string }) => (
                <Tab
                  key={tab.key}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {tab.title}
                      {tabs.length > 1 && (
                        <CloseIcon
                          sx={{
                            fontSize: 16,
                            '&:hover': {
                              color: 'error.main',
                            },
                          }}
                          onClick={(e) => handleCloseTab(e, tab.key)}
                        />
                      )}
                    </Box>
                  }
                  value={tab.key}
                  sx={{
                    minWidth: 120,
                  }}
                />
              ))}
            </Tabs>
          </Box>
        )}
        
        {/* 页面内容 */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;