# 系统参数配置功能实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现完整的系统参数配置功能，包括后端 CRUD 接口和前端管理页面

**Architecture:** 采用单表设计，通过 config_key 唯一索引支持快速查询。后端遵循 MVC 模式，使用 MyBatis-Plus 进行数据访问。前端参照数据字典实现，使用 Material-UI 组件库。

**Tech Stack:** Spring Boot 3.2.x, MyBatis-Plus 3.5.x, React 18, Material-UI 5.x, SQLite (dev) / MySQL (prod)

---

## Chunk 1: 后端实现

### Task 1: 创建数据库表

**Files:**
- Modify: `backend/src/main/resources/sql/init-sqlite.sql`
- Modify: `backend/src/main/resources/sql/init.sql` (如果存在 MySQL 初始化脚本)

- [ ] **Step 1: 在 init-sqlite.sql 末尾添加建表语句**

```sql
-- ============================================
-- 系统参数配置表
-- ============================================
DROP TABLE IF EXISTS sys_config;

CREATE TABLE sys_config (
    config_id INTEGER PRIMARY KEY,
    config_name VARCHAR(100) NOT NULL,
    config_key VARCHAR(50) NOT NULL UNIQUE,
    config_value VARCHAR(500),
    config_type VARCHAR(50) DEFAULT 'sys',
    description VARCHAR(255),
    is_editable INTEGER DEFAULT 1,
    status INTEGER DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);
```

- [ ] **Step 2: 添加初始化数据**

```sql
-- 初始化系统参数
INSERT INTO sys_config (config_id, config_name, config_key, config_value, config_type, description, is_editable, status) VALUES
(1, '用户注册开关', 'sys.user.register', 'true', 'sys', '是否允许用户自主注册', 1, 1),
(2, '登录验证码开关', 'sys.login.captcha', 'true', 'sys', '登录时是否显示验证码', 1, 1),
(3, '最大上传文件大小 (MB)', 'sys.upload.maxSize', '10', 'sys', '允许上传的最大文件大小', 1, 1),
(4, '会话超时时间 (分钟)', 'sys.session.timeout', '30', 'sys', '用户会话超时时间', 1, 1),
(5, '网站标题', 'sys.website.title', '企业后台管理系统', 'sys', '网站主标题', 1, 1),
(6, '版权信息', 'sys.copyright', '© 2026 Enterprise Inc.', 'sys', '页面底部版权信息', 1, 1);
```

- [ ] **Step 3: 初始化 SQLite 数据库**

```bash
cd backend/data
sqlite3 enterprise_admin.db < ../src/main/resources/sql/init-sqlite.sql
```

Expected: 数据库更新成功，无错误

- [ ] **Step 4: 提交**

```bash
git add backend/src/main/resources/sql/init-sqlite.sql
git commit -m "feat: add sys_config table and init data for SQLite"
```

### Task 2: 创建实体类 Config.java

**Files:**
- Create: `backend/src/main/java/com/enterprise/entity/Config.java`

- [ ] **Step 1: 创建实体类**

```java
package com.enterprise.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统参数配置实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_config")
public class Config implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 参数 ID
     */
    @TableId(value = "config_id", type = IdType.ASSIGN_ID)
    private Long configId;

    /**
     * 参数名称
     */
    private String configName;

    /**
     * 参数键
     */
    private String configKey;

    /**
     * 参数值
     */
    private String configValue;

    /**
     * 分组类型
     */
    private String configType;

    /**
     * 描述
     */
    private String description;

    /**
     * 是否可编辑 (1-是 0-否)
     */
    private Integer isEditable;

    /**
     * 状态 (1-启用 0-禁用)
     */
    private Integer status;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除 0-未删除 1-已删除
     */
    @TableLogic
    private Integer deleted;
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/enterprise/entity/Config.java
git commit -m "feat: add Config entity class"
```

### Task 3: 创建 DTO 类

**Files:**
- Create: `backend/src/main/java/com/enterprise/dto/ConfigDTO.java`
- Create: `backend/src/main/java/com/enterprise/dto/ConfigQueryDTO.java`

- [ ] **Step 1: 创建 ConfigDTO**

```java
package com.enterprise.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

/**
 * 参数配置数据传输对象
 */
@Data
public class ConfigDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long configId;

    @NotBlank(message = "参数名称不能为空")
    @Size(max = 100, message = "参数名称不能超过 100 字符")
    private String configName;

    @NotBlank(message = "参数键不能为空")
    @Size(max = 50, message = "参数键不能超过 50 字符")
    private String configKey;

    @Size(max = 500, message = "参数值不能超过 500 字符")
    private String configValue;

    @Size(max = 50, message = "分组类型不能超过 50 字符")
    private String configType;

    private String description;

    private Integer isEditable;

    private Integer status;
}
```

- [ ] **Step 2: 创建 ConfigQueryDTO**

```java
package com.enterprise.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 参数配置查询 DTO
 */
@Data
public class ConfigQueryDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 按参数名称模糊查询
     */
    private String configName;

    /**
     * 按参数键模糊查询
     */
    private String configKey;

    /**
     * 按分组类型精确查询
     */
    private String configType;

    /**
     * 按状态筛选
     */
    private Integer status;
}
```

- [ ] **Step 3: 提交**

```bash
git add backend/src/main/java/com/enterprise/dto/ConfigDTO.java backend/src/main/java/com/enterprise/dto/ConfigQueryDTO.java
git commit -m "feat: add ConfigDTO and ConfigQueryDTO classes"
```

### Task 4: 创建 Mapper 接口

**Files:**
- Create: `backend/src/main/java/com/enterprise/mapper/ConfigMapper.java`

- [ ] **Step 1: 创建 Mapper 接口**

```java
package com.enterprise.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.enterprise.entity.Config;
import org.apache.ibatis.annotations.Mapper;

/**
 * 参数配置 Mapper 接口
 */
@Mapper
public interface ConfigMapper extends BaseMapper<Config> {

}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/enterprise/mapper/ConfigMapper.java
git commit -m "feat: add ConfigMapper interface"
```

### Task 5: 创建 Service 接口和实现

**Files:**
- Create: `backend/src/main/java/com/enterprise/service/ConfigService.java`
- Create: `backend/src/main/java/com/enterprise/service/impl/ConfigServiceImpl.java`

- [ ] **Step 1: 创建 Service 接口**

```java
package com.enterprise.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.dto.ConfigDTO;
import com.enterprise.dto.ConfigQueryDTO;
import com.enterprise.entity.Config;

import java.util.List;

/**
 * 参数配置服务接口
 */
public interface ConfigService {

    /**
     * 分页查询参数列表
     */
    Page<Config> list(ConfigQueryDTO query, Integer current, Integer size);

    /**
     * 获取参数详情
     */
    Config getById(Long configId);

    /**
     * 新增参数
     */
    void add(ConfigDTO dto);

    /**
     * 修改参数
     */
    void update(ConfigDTO dto);

    /**
     * 删除参数
     */
    void delete(Long configId);

    /**
     * 批量删除参数
     */
    void batchDelete(List<Long> ids);

    /**
     * 根据 key 获取参数值
     */
    String getValueByKey(String configKey);

    /**
     * 刷新缓存
     */
    void refreshCache();
}
```

- [ ] **Step 2: 创建 Service 实现类**

```java
package com.enterprise.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.dto.ConfigDTO;
import com.enterprise.dto.ConfigQueryDTO;
import com.enterprise.entity.Config;
import com.enterprise.exception.BusinessException;
import com.enterprise.mapper.ConfigMapper;
import com.enterprise.service.ConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

/**
 * 参数配置服务实现类
 */
@Service
@RequiredArgsConstructor
public class ConfigServiceImpl implements ConfigService {

    private final ConfigMapper configMapper;

    /**
     * 参数缓存 (key -> value)
     */
    private final Map<String, String> configCache = new ConcurrentHashMap<>();

    @Override
    public Page<Config> list(ConfigQueryDTO query, Integer current, Integer size) {
        LambdaQueryWrapper<Config> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(query.getConfigName())) {
            wrapper.like(Config::getConfigName, query.getConfigName());
        }
        if (StringUtils.hasText(query.getConfigKey())) {
            wrapper.like(Config::getConfigKey, query.getConfigKey());
        }
        if (StringUtils.hasText(query.getConfigType())) {
            wrapper.eq(Config::getConfigType, query.getConfigType());
        }
        if (query.getStatus() != null) {
            wrapper.eq(Config::getStatus, query.getStatus());
        }

        wrapper.orderByAsc(Config::getConfigType, Config::getConfigKey);

        return configMapper.selectPage(new Page<>(current, size), wrapper);
    }

    @Override
    public Config getById(Long configId) {
        Config config = configMapper.selectById(configId);
        if (config == null) {
            throw new BusinessException("参数不存在");
        }
        return config;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void add(ConfigDTO dto) {
        // 检查参数键是否已存在
        LambdaQueryWrapper<Config> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Config::getConfigKey, dto.getConfigKey());
        if (configMapper.selectCount(wrapper) > 0) {
            throw new BusinessException("参数键已存在");
        }

        Config config = new Config();
        config.setConfigName(dto.getConfigName());
        config.setConfigKey(dto.getConfigKey());
        config.setConfigValue(dto.getConfigValue());
        config.setConfigType(dto.getConfigType());
        config.setDescription(dto.getDescription());
        config.setIsEditable(dto.getIsEditable() != null ? dto.getIsEditable() : 1);
        config.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);

        configMapper.insert(config);

        // 更新缓存
        configCache.put(config.getConfigKey(), config.getConfigValue());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(ConfigDTO dto) {
        Config existing = configMapper.selectById(dto.getConfigId());
        if (existing == null) {
            throw new BusinessException("参数不存在");
        }

        // 检查是否可编辑
        if (existing.getIsEditable() == 0) {
            throw new BusinessException("该参数不可编辑");
        }

        // 检查参数键是否与其他记录重复
        LambdaQueryWrapper<Config> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Config::getConfigKey, dto.getConfigKey())
               .ne(Config::getConfigId, dto.getConfigId());
        if (configMapper.selectCount(wrapper) > 0) {
            throw new BusinessException("参数键已存在");
        }

        existing.setConfigName(dto.getConfigName());
        existing.setConfigKey(dto.getConfigKey());
        existing.setConfigValue(dto.getConfigValue());
        existing.setConfigType(dto.getConfigType());
        existing.setDescription(dto.getDescription());
        existing.setIsEditable(dto.getIsEditable());
        existing.setStatus(dto.getStatus());

        configMapper.updateById(existing);

        // 更新缓存
        configCache.put(dto.getConfigKey(), dto.getConfigValue());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long configId) {
        Config config = configMapper.selectById(configId);
        if (config != null) {
            // 检查是否可删除
            if (config.getIsEditable() == 0) {
                throw new BusinessException("该参数不可删除");
            }
            configMapper.deleteById(configId);
            // 清除缓存
            configCache.remove(config.getConfigKey());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDelete(List<Long> ids) {
        for (Long id : ids) {
            delete(id);
        }
    }

    @Override
    public String getValueByKey(String configKey) {
        // 先查缓存
        String value = configCache.get(configKey);
        if (value != null) {
            return value;
        }

        // 缓存未命中，查数据库
        Config config = configMapper.selectOne(
            new LambdaQueryWrapper<Config>()
                .eq(Config::getConfigKey, configKey)
                .eq(Config::getStatus, 1)
        );

        if (config == null) {
            throw new BusinessException("参数不存在：" + configKey);
        }

        value = config.getConfigValue();
        configCache.put(configKey, value);
        return value;
    }

    @Override
    public void refreshCache() {
        configCache.clear();
        // 加载所有启用的参数到缓存
        List<Config> configs = configMapper.selectList(
            new LambdaQueryWrapper<Config>()
                .eq(Config::getStatus, 1)
        );
        for (Config config : configs) {
            configCache.put(config.getConfigKey(), config.getConfigValue());
        }
    }
}
```

- [ ] **Step 3: 提交**

```bash
git add backend/src/main/java/com/enterprise/service/ConfigService.java backend/src/main/java/com/enterprise/service/impl/ConfigServiceImpl.java
git commit -m "feat: add ConfigService interface and implementation"
```

### Task 6: 创建 Controller 类

**Files:**
- Create: `backend/src/main/java/com/enterprise/controller/ConfigController.java`

- [ ] **Step 1: 创建 Controller 类**

```java
package com.enterprise.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.Result;
import com.enterprise.dto.ConfigDTO;
import com.enterprise.dto.ConfigQueryDTO;
import com.enterprise.entity.Config;
import com.enterprise.service.ConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 参数配置控制器
 */
@Tag(name = "系统参数配置", description = "系统参数管理接口")
@RestController
@RequestMapping("/business/config")
@RequiredArgsConstructor
public class ConfigController {

    private final ConfigService configService;

    @GetMapping("/list")
    @Operation(summary = "分页查询参数列表")
    @PreAuthorize("hasAuthority('business:config:list')")
    public Result<Page<Config>> list(ConfigQueryDTO query,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(configService.list(query, current, size));
    }

    @GetMapping("/{configId}")
    @Operation(summary = "获取参数详情")
    @PreAuthorize("hasAuthority('business:config:query')")
    public Result<Config> getById(@PathVariable Long configId) {
        return Result.success(configService.getById(configId));
    }

    @PostMapping
    @Operation(summary = "新增参数")
    @PreAuthorize("hasAuthority('business:config:add')")
    public Result<Void> add(@Valid @RequestBody ConfigDTO dto) {
        configService.add(dto);
        return Result.success();
    }

    @PutMapping
    @Operation(summary = "修改参数")
    @PreAuthorize("hasAuthority('business:config:edit')")
    public Result<Void> update(@Valid @RequestBody ConfigDTO dto) {
        configService.update(dto);
        return Result.success();
    }

    @DeleteMapping("/{configId}")
    @Operation(summary = "删除参数")
    @PreAuthorize("hasAuthority('business:config:delete')")
    public Result<Void> delete(@PathVariable Long configId) {
        configService.delete(configId);
        return Result.success();
    }

    @DeleteMapping
    @Operation(summary = "批量删除参数")
    @PreAuthorize("hasAuthority('business:config:delete')")
    public Result<Void> batchDelete(@RequestParam List<Long> ids) {
        configService.batchDelete(ids);
        return Result.success();
    }

    @GetMapping("/value/{configKey}")
    @Operation(summary = "根据 key 获取参数值")
    public Result<String> getValueByKey(@PathVariable String configKey) {
        return Result.success(configService.getValueByKey(configKey));
    }

    @PostMapping("/refresh")
    @Operation(summary = "刷新参数缓存")
    @PreAuthorize("hasAuthority('business:config:edit')")
    public Result<Void> refreshCache() {
        configService.refreshCache();
        return Result.success();
    }
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/enterprise/controller/ConfigController.java
git commit -m "feat: add ConfigController REST controller"
```

### Task 7: 添加菜单权限数据

**Files:**
- Modify: `backend/src/main/resources/sql/init-sqlite.sql`

- [ ] **Step 1: 更新 sys_menu 表，添加参数配置的子菜单权限**

在现有的菜单数据后添加：

```sql
-- 参数配置子菜单权限
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES
(17, 12, '参数查询', 3, NULL, NULL, 'business:config:query', NULL, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(18, 12, '参数新增', 3, NULL, NULL, 'business:config:add', NULL, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(19, 12, '参数修改', 3, NULL, NULL, 'business:config:edit', NULL, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(20, 12, '参数删除', 3, NULL, NULL, 'business:config:delete', NULL, 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- 超级管理员角色关联新增的菜单
INSERT INTO sys_role_menu (role_id, menu_id) SELECT 1, menu_id FROM sys_menu WHERE menu_id > 16;
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/resources/sql/init-sqlite.sql
git commit -m "feat: add config menu permissions and role bindings"
```

---

## Chunk 2: 前端实现

### Task 8: 创建前端页面组件 ConfigList.tsx

**Files:**
- Create: `frontend/src/pages/Business/ConfigList.tsx`

- [ ] **Step 1: 创建页面组件**

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { http, PageData } from '@services/api';

interface ConfigRecord {
  configId: number;
  configName: string;
  configKey: string;
  configValue: string;
  configType: string;
  description?: string;
  isEditable: number;
  status: number;
  createTime: string;
}

export const ConfigList: React.FC = () => {
  const [configs, setConfigs] = useState<ConfigRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  const [searchConfigName, setSearchConfigName] = useState('');
  const [searchConfigKey, setSearchConfigKey] = useState('');
  const [searchConfigType, setSearchConfigType] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ConfigRecord | null>(null);
  const [form, setForm] = useState({
    configName: '',
    configKey: '',
    configValue: '',
    configType: 'sys',
    description: '',
    isEditable: 1,
    status: 1,
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showMessage = (msg: string, severity: 'success' | 'error' = 'success') =>
    setSnackbar({ open: true, message: msg, severity });

  const loadConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        current: pagination.page + 1,
        size: pagination.pageSize,
      };
      if (searchConfigName) params.configName = searchConfigName;
      if (searchConfigKey) params.configKey = searchConfigKey;
      if (searchConfigType) params.configType = searchConfigType;

      const res = await http.get<PageData<ConfigRecord>>('/business/config/list', params);
      setConfigs(res.records || []);
      setTotal(Number(res.total) || 0);
    } catch (err: any) {
      showMessage(err?.message || '加载失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination, searchConfigName, searchConfigKey, searchConfigType]);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'configName', headerName: '参数名称', flex: 1, minWidth: 150 },
    { field: 'configKey', headerName: '参数键', flex: 1.2, minWidth: 180 },
    { field: 'configValue', headerName: '参数值', flex: 1, minWidth: 150 },
    {
      field: 'configType',
      headerName: '分组类型',
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value || 'sys'} size="small" color="primary" variant="outlined" />
      ),
    },
    {
      field: 'status',
      headerName: '状态',
      width: 80,
      renderCell: (params) => (
        <Chip label={params.value === 1 ? '启用' : '禁用'} color={params.value === 1 ? 'success' : 'default'} size="small" />
      ),
    },
    {
      field: 'isEditable',
      headerName: '可编辑',
      width: 80,
      renderCell: (params) => (
        <Chip label={params.value === 1 ? '是' : '否'} color={params.value === 1 ? 'success' : 'default'} size="small" />
      ),
    },
    {
      field: 'createTime',
      headerName: '创建时间',
      width: 160,
      valueFormatter: (params) => params.value ? dayjs(params.value).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" color="info" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row)}
            disabled={params.row.isEditable === 0}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const gridRows = configs.map((c) => ({ ...c, id: c.configId }));

  const handleAdd = () => {
    setEditingConfig(null);
    setForm({
      configName: '',
      configKey: '',
      configValue: '',
      configType: 'sys',
      description: '',
      isEditable: 1,
      status: 1,
    });
    setDialogOpen(true);
  };

  const handleEdit = (config: ConfigRecord) => {
    setEditingConfig(config);
    setForm({
      configName: config.configName,
      configKey: config.configKey,
      configValue: config.configValue,
      configType: config.configType || 'sys',
      description: config.description || '',
      isEditable: config.isEditable,
      status: config.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (config: ConfigRecord) => {
    if (!window.confirm(`确定要删除参数 "${config.configName}" 吗？`)) return;
    try {
      await http.delete(`/business/config/${config.configId}`);
      showMessage('删除成功');
      loadConfigs();
    } catch (err: any) {
      showMessage(err?.message || '删除失败', 'error');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingConfig) {
        await http.put('/business/config', { configId: editingConfig.configId, ...form });
        showMessage('修改成功');
      } else {
        await http.post('/business/config', form);
        showMessage('新增成功');
      }
      setDialogOpen(false);
      loadConfigs();
    } catch (err: any) {
      showMessage(err?.message || '操作失败', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>参数配置</Typography>
          <Typography variant="body2" color="text.secondary">管理系统运行参数配置</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadConfigs}>刷新</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>新增参数</Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="搜索参数名称"
              value={searchConfigName}
              onChange={(e) => setSearchConfigName(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              sx={{ minWidth: 200 }}
            />
            <TextField
              size="small"
              placeholder="搜索参数键"
              value={searchConfigKey}
              onChange={(e) => setSearchConfigKey(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <TextField
              size="small"
              placeholder="分组类型"
              value={searchConfigType}
              onChange={(e) => setSearchConfigType(e.target.value)}
              sx={{ minWidth: 150 }}
            />
            <Button variant="contained" onClick={() => setPagination({ ...pagination, page: 0 })}>搜索</Button>
            <Button variant="outlined" onClick={() => { setSearchConfigName(''); setSearchConfigKey(''); setSearchConfigType(''); }}>重置</Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={gridRows}
            columns={columns}
            loading={loading}
            rowCount={total}
            paginationMode="server"
            paginationModel={pagination}
            onPaginationModelChange={setPagination}
            disableRowSelectionOnClick
            autoHeight
            pageSizeOptions={[10, 20, 50]}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': { border: 'none' },
              '& .MuiDataGrid-columnHeaders': { backgroundColor: 'action.hover' },
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingConfig ? '编辑参数' : '新增参数'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="参数名称"
              value={form.configName}
              onChange={(e) => setForm({ ...form, configName: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="参数键"
              value={form.configKey}
              onChange={(e) => setForm({ ...form, configKey: e.target.value })}
              fullWidth
              required
              disabled={!!editingConfig}
              placeholder="例如：sys.user.register"
            />
            <TextField
              label="参数值"
              value={form.configValue}
              onChange={(e) => setForm({ ...form, configValue: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="分组类型"
              value={form.configType}
              onChange={(e) => setForm({ ...form, configType: e.target.value })}
              fullWidth
              placeholder="例如：sys, business"
            />
            <TextField
              label="描述"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isEditable === 1}
                  onChange={(e) => setForm({ ...form, isEditable: e.target.checked ? 1 : 0 })}
                />
              }
              label="允许编辑"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.status === 1}
                  onChange={(e) => setForm({ ...form, status: e.target.checked ? 1 : 0 })}
                />
              }
              label="启用"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={handleSubmit} variant="contained">确定</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfigList;
```

- [ ] **Step 2: 提交**

```bash
git add frontend/src/pages/Business/ConfigList.tsx
git commit -m "feat: add ConfigList page component"
```

### Task 9: 更新路由配置

**Files:**
- Modify: `frontend/src/router/index.tsx`

- [ ] **Step 1: 导入 ConfigList 组件并更新路由**

```tsx
// 在文件顶部的导入处添加:
import { ConfigList } from '@pages/Business/ConfigList';

// 找到 /business/config 路由，将 element 从占位文字改为:
{
  path: '/business/config',
  element: (
    <ProtectedRoute>
      <ConfigList />
    </ProtectedRoute>
  ),
},
```

- [ ] **Step 2: 提交**

```bash
git add frontend/src/router/index.tsx
git commit -m "feat: update router to use ConfigList component"
```

### Task 10: 重新初始化数据库并测试

**Files:** N/A (manual testing)

- [ ] **Step 1: 重新初始化 SQLite 数据库**

```bash
cd backend/data
rm enterprise_admin.db
sqlite3 enterprise_admin.db < ../src/main/resources/sql/init-sqlite.sql
```

- [ ] **Step 2: 重启后端服务**

```bash
cd backend
mvn spring-boot:run
```

Expected: 后端启动成功，访问 http://localhost:8081/api/doc.html 可以看到新增的接口

- [ ] **Step 3: 访问前端页面**

打开浏览器访问 http://localhost:3000/business/config

Expected: 页面正常加载，显示初始化参数数据

- [ ] **Step 4: 测试 CRUD 功能**
  - 新增参数
  - 编辑参数
  - 删除参数
  - 搜索筛选

---

## Chunk 3: 验收与文档

### Task 11: 最终验收

**Files:** N/A

- [ ] **Step 1: 验证后端接口**

访问 Swagger/Knife4j: http://localhost:8081/api/doc.html

检查项目:
- 所有接口文档正常显示
- 权限标识正确配置
- 接口可以正常调用

- [ ] **Step 2: 验证前端功能**

访问 http://localhost:3000/business/config

检查项目:
- 列表加载正常
- 新增功能正常
- 编辑功能正常 (可编辑参数)
- 删除功能正常 (可编辑参数)
- 不可编辑参数的编辑/删除按钮禁用
- 搜索筛选正常
- 分页功能正常

- [ ] **Step 3: 验证权限控制**

使用非超级管理员账号登录，验证无权限时接口返回 403

### Task 12: 代码审查与清理

**Files:** All modified files

- [ ] **Step 1: 运行后端编译检查**

```bash
cd backend
mvn clean compile -DskipTests
```

Expected: 编译成功，无错误

- [ ] **Step 2: 检查代码格式**

```bash
cd frontend
npm run lint
```

- [ ] **Step 3: 最终提交**

```bash
git add .
git commit -m "feat: implement system parameter configuration feature"
```

---

## 验收标准

1. 后端接口可通过 Swagger/Knife4j 访问并测试
2. 前端页面可正常访问 `/business/config`
3. CRUD 操作全部可用
4. 权限控制正常工作
5. 初始化数据正确加载
6. 缓存功能正常工作 (getValueByKey 先查缓存)
7. 不可编辑的参数无法修改和删除
