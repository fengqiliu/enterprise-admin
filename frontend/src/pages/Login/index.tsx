import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LockOutlined as LockOutlinedIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Chat as WechatIcon,
} from '@mui/icons-material';
import { useUserStore } from '@stores';
import { useNavigate } from 'react-router-dom';
import { http } from '@services/api';

// 后端登录响应类型
interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  userInfo: {
    userId: number;
    username: string;
    nickname: string;
    avatar?: string;
    email?: string;
    phone?: string;
    roles: string[];
    permissions: string[];
  };
}

export const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setUser, setToken } = useUserStore();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await http.post<LoginResponse>('/auth/login', {
        username: formData.username,
        password: formData.password,
      });

      const { token, userInfo } = res;

      setUser({
        id: String(userInfo.userId),
        username: userInfo.username,
        nickname: userInfo.nickname || userInfo.username,
        avatar: userInfo.avatar,
        email: userInfo.email,
        roles: userInfo.roles || [],
        permissions: userInfo.permissions || [],
      });
      setToken(token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo 和标题 */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
            >
              <LockOutlinedIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              企业后台管理系统
            </Typography>
            <Typography variant="body2" color="text.secondary">
              欢迎回来，请登录您的账号
            </Typography>
          </Box>

          {/* 错误提示 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="用户名"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="请输入用户名"
              autoComplete="username"
            />
            <TextField
              label="密码"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="请输入密码"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* 记住我 & 忘记密码 */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="记住我"
                sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
              />
              <Button
                color="primary"
                sx={{ fontSize: '0.875rem', textTransform: 'none' }}
              >
                忘记密码？
              </Button>
            </Box>

            {/* 登录按钮 */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                },
              }}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>

          {/* 分割线 */}
          <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
            <Divider sx={{ flex: 1 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ px: 2, fontSize: '0.75rem' }}
            >
              其他方式登录
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* 第三方登录 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton
              sx={{
                width: 48,
                height: 48,
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <GoogleIcon sx={{ color: '#DB4437' }} />
            </IconButton>
            <IconButton
              sx={{
                width: 48,
                height: 48,
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              sx={{
                width: 48,
                height: 48,
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                },
              }}
            >
              <WechatIcon sx={{ color: '#07C160' }} />
            </IconButton>
          </Box>

          {/* 底部链接 */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              还没有账号？{' '}
              <Button
                color="primary"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                立即注册
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
