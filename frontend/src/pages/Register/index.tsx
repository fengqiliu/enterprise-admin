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
  Link,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAddOutlined as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useUserStore } from '@stores';
import { useNavigate } from 'react-router-dom';
import { http } from '@services/api';

// 注册响应类型
interface RegisterResponse {
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

export const Register: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setUser, setToken } = useUserStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 表单验证
    if (!formData.username || !formData.password) {
      setError('请填写必填项');
      return;
    }

    if (formData.username.length < 3) {
      setError('用户名长度至少 3 个字符');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少 6 个字符');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const res = await http.post<RegisterResponse>('/auth/register', {
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname || formData.username,
        email: formData.email,
        phone: formData.phone,
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
      setSuccess(true);

      // 注册成功，1 秒后跳转到首页
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err?.message || '注册失败，请稍后重试');
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
          maxWidth: 480,
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo 和标题 */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
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
              <PersonAddIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              创建新账号
            </Typography>
            <Typography variant="body2" color="text.secondary">
              欢迎注册企业后台管理系统
            </Typography>
          </Box>

          {/* 错误提示 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* 成功提示 */}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              注册成功！正在跳转...
            </Alert>
          )}

          {/* 注册表单 */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="用户名 *"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="请输入用户名（至少 3 个字符）"
              autoComplete="username"
              required
            />

            <TextField
              label="密码 *"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="请输入密码（至少 6 个字符）"
              autoComplete="new-password"
              required
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

            <TextField
              label="确认密码 *"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="请再次输入密码"
              autoComplete="new-password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="昵称"
              fullWidth
              margin="normal"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="请输入昵称（可选）"
              autoComplete="nickname"
            />

            <TextField
              label="邮箱"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="请输入邮箱（可选）"
              autoComplete="email"
            />

            <TextField
              label="手机号"
              type="tel"
              fullWidth
              margin="normal"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="请输入手机号（可选）"
              autoComplete="tel"
            />

            {/* 注册按钮 */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || success}
              sx={{
                mt: 3,
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
              {loading ? '注册中...' : success ? '注册成功' : '立即注册'}
            </Button>
          </form>

          {/* 底部链接 */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              已有账号？{' '}
              <Link
                component="button"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 600, textTransform: 'none' }}
              >
                立即登录
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
