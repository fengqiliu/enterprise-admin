import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useUserStore } from '@stores';

// 响应数据结构
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 分页数据结构
export interface PageData<T = any> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 分页参数
export interface PageParams {
  current?: number;
  size?: number;
  [key: string]: any;
}

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const { token } = useUserStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data;
    
    // 根据后端返回的 code 处理
    if (code === 200 || code === 0) {
      return data;
    }
    
    // 处理错误
    if (code === 401) {
      // Token 过期，跳转登录
      useUserStore.getState().logout();
      window.location.href = '/login';
    }
    
    return Promise.reject(new Error(message || '请求失败'));
  },
  (error) => {
    // HTTP 错误处理
    const { response } = error;
    if (response) {
      switch (response.status) {
        case 400:
          console.error('请求参数错误');
          break;
        case 401:
          console.error('未授权，请重新登录');
          useUserStore.getState().logout();
          window.location.href = '/login';
          break;
        case 403:
          console.error('拒绝访问');
          break;
        case 404:
          console.error('请求资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        case 503:
          console.error('服务不可用');
          break;
        default:
          console.error('网络错误');
      }
    } else {
      console.error('网络连接失败');
    }
    return Promise.reject(error);
  }
);

// 封装请求方法
export const http = {
  get<T = any>(url: string, params?: any): Promise<T> {
    return api.get(url, { params });
  },

  post<T = any>(url: string, data?: any): Promise<T> {
    return api.post(url, data);
  },

  put<T = any>(url: string, data?: any): Promise<T> {
    return api.put(url, data);
  },

  delete<T = any>(url: string, params?: any): Promise<T> {
    return api.delete(url, { params });
  },

  upload<T = any>(url: string, formData: FormData): Promise<T> {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  download(url: string, filename: string): Promise<void> {
    return api.get(url, {
      responseType: 'blob',
    }).then((res) => {
      const blob = new Blob([res.data]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  },
};

export default api;