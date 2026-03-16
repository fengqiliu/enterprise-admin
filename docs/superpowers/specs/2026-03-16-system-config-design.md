# 系统参数配置功能设计文档

**日期**: 2026-03-16
**状态**: 已批准

---

## 1. 概述

### 1.1 功能目标

开发"系统参数配置"功能，用于管理系统运行时的动态配置参数。该功能允许管理员在不修改代码的情况下调整系统行为。

### 1.2 使用场景

- 系统开关控制（用户注册开关、验证码开关等）
- 业务参数配置（最大上传文件大小、会话超时时间等）
- 第三方服务配置（邮件服务器、OSS 存储等）
- 运营参数配置（网站标题、版权信息、客服联系方式等）

### 1.3 设计原则

- **简单性**: 采用单表设计，避免过度工程化
- **可扩展性**: 通过 `config_type` 字段支持逻辑分组
- **类型安全**: 后端提供完整的 DTO 验证
- **用户体验**: 参照数据字典的交互模式，降低学习成本

---

## 2. 数据库设计

### 2.1 表结构

**MySQL DDL (production):**
```sql
CREATE TABLE sys_config (
    config_id BIGINT PRIMARY KEY,
    config_name VARCHAR(100) NOT NULL,      -- 参数名称
    config_key VARCHAR(50) NOT NULL UNIQUE, -- 参数键 (如：sys.user.register)
    config_value VARCHAR(500),              -- 参数值
    config_type VARCHAR(50) DEFAULT 'sys',  -- 分组类型 (如：sys, business, email)
    description VARCHAR(255),               -- 描述
    is_editable TINYINT DEFAULT 1,          -- 是否可修改 (1-是 0-否)
    status TINYINT DEFAULT 1,               -- 状态 (1-启用 0-禁用)
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
);
```

**SQLite DDL (development):**
```sql
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

### 2.2 索引设计

- `config_key` - UNIQUE 索引，支持快速查找
- `config_type` - 普通索引，支持分组查询

### 2.3 config_key 命名规范

格式：`^[a-z]+\.[a-z]+(\.[a-z]+)*$`

示例：
- `sys.user.register` - 系统模块 - 用户功能 - 注册开关
- `business.upload.maxSize` - 业务模块 - 上传功能 - 最大大小
- `email.smtp.host` - 邮件模块 - SMTP 配置 - 主机地址

### 2.3 初始化数据

```sql
-- 系统配置
INSERT INTO sys_config (config_id, config_name, config_key, config_value, config_type, description, is_editable, status) VALUES
(1, '用户注册开关', 'sys.user.register', 'true', 'sys', '是否允许用户自主注册', 1, 1),
(2, '登录验证码开关', 'sys.login.captcha', 'true', 'sys', '登录时是否显示验证码', 1, 1),
(3, '最大上传文件大小 (MB)', 'sys.upload.maxSize', '10', 'sys', '允许上传的最大文件大小', 1, 1),
(4, '会话超时时间 (分钟)', 'sys.session.timeout', '30', 'sys', '用户会话超时时间', 1, 1),
(5, '网站标题', 'sys.website.title', '企业后台管理系统', 'sys', '网站主标题', 1, 1),
(6, '版权信息', 'sys.copyright', '© 2026 Enterprise Inc.', 'sys', '页面底部版权信息', 1, 1);
```

---

## 3. 后端实现

### 3.1 目录结构

```
backend/src/main/java/com/enterprise/
├── controller/
│   └── ConfigController.java
├── dto/
│   ├── ConfigDTO.java
│   └── ConfigQueryDTO.java
├── entity/
│   └── Config.java
├── mapper/
│   └── ConfigMapper.java
└── service/
    ├── ConfigService.java
    └── impl/
        └── ConfigServiceImpl.java
```

### 3.2 实体类 (Config.java)

```java
@Data
@TableName("sys_config")
public class Config implements Serializable {
    @TableId(value = "config_id", type = IdType.ASSIGN_ID)
    private Long configId;

    private String configName;
    private String configKey;
    private String configValue;
    private String configType;
    private String description;
    private Integer isEditable;
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
```

### 3.3 DTO 设计

**ConfigDTO.java**
```java
@Data
public class ConfigDTO {
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

**ConfigQueryDTO.java**
```java
@Data
public class ConfigQueryDTO {
    private String configName;      // 按名称模糊查询
    private String configKey;       // 按键模糊查询
    private String configType;      // 按类型精确查询
    private Integer status;         // 按状态筛选
}
```

### 3.4 Controller 接口

```java
@Tag(name = "系统参数配置", description = "系统参数管理接口")
@RestController
@RequestMapping("/business/config")
@RequiredArgsConstructor
public class ConfigController {

    private final ConfigService configService;

    @GetMapping("/list")
    @Operation(summary = "分页查询参数列表")
    @PreAuthorize("hasAuthority('business:config:list')")
    public Result<PageResult<Config>> list(ConfigQueryDTO query,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size);

    @GetMapping("/{configId}")
    @Operation(summary = "获取参数详情")
    @PreAuthorize("hasAuthority('business:config:query')")
    public Result<Config> getById(@PathVariable Long configId);

    @PostMapping
    @Operation(summary = "新增参数")
    @PreAuthorize("hasAuthority('business:config:add')")
    public Result<Void> add(@Valid @RequestBody ConfigDTO dto);

    @PutMapping
    @Operation(summary = "修改参数")
    @PreAuthorize("hasAuthority('business:config:edit')")
    public Result<Void> update(@Valid @RequestBody ConfigDTO dto);

    @DeleteMapping("/{configId}")
    @Operation(summary = "删除参数")
    @PreAuthorize("hasAuthority('business:config:delete')")
    public Result<Void> delete(@PathVariable Long configId);

    @DeleteMapping
    @Operation(summary = "批量删除参数")
    @PreAuthorize("hasAuthority('business:config:delete')")
    public Result<Void> batchDelete(@RequestParam List<Long> ids);

    @GetMapping("/value/{configKey}")
    @Operation(summary = "根据 key 获取参数值")
    public Result<String> getValueByKey(@PathVariable String configKey);

    @PostMapping("/refresh")
    @Operation(summary = "刷新参数缓存")
    @PreAuthorize("hasAuthority('business:config:edit')")
    public Result<Void> refreshCache();
}
```

### 3.5 Service 接口与实现要点

**ConfigService.java**
```java
public interface ConfigService {
    PageResult<Config> list(ConfigQueryDTO query, Integer current, Integer size);
    Config getById(Long configId);
    void add(ConfigDTO dto);
    void update(ConfigDTO dto);
    void delete(Long configId);
    void batchDelete(List<Long> ids);
    String getValueByKey(String configKey);
    void refreshCache();
}
```

**实现要点 (ConfigServiceImpl.java):**

1. **add() 方法 - 唯一性校验:**
```java
// 检查参数键是否已存在
LambdaQueryWrapper<Config> wrapper = new LambdaQueryWrapper<>();
wrapper.eq(Config::getConfigKey, dto.getConfigKey());
if (configMapper.selectCount(wrapper) > 0) {
    throw new RuntimeException("参数键已存在");
}
Config config = BeanUtil.copyProperties(dto, Config.class);
configMapper.insert(config);
```

2. **update() 方法 - 唯一性校验 + 可编辑校验:**
```java
// 检查是否可编辑
Config existing = configMapper.selectById(dto.getConfigId());
if (existing.getIsEditable() == 0) {
    throw new RuntimeException("该参数不可编辑");
}
// 检查参数键是否与其他记录重复
LambdaQueryWrapper<Config> wrapper = new LambdaQueryWrapper<>();
wrapper.eq(Config::getConfigKey, dto.getConfigKey())
       .ne(Config::getConfigId, dto.getConfigId());
if (configMapper.selectCount(wrapper) > 0) {
    throw new RuntimeException("参数键已存在");
}
configMapper.updateById(config);
```

3. **delete() / batchDelete() 方法:**
- 使用 MyBatis-Plus 的逻辑删除 (`@TableLogic`)
- 自动触发缓存失效

4. **getValueByKey() 方法:**
- 先查缓存，缓存未命中则查数据库
- 参数不存在时抛出异常

5. **缓存策略:**
- 使用应用内缓存 (ConcurrentHashMap 或 Caffeine)
- Redis 可用时使用 Redis 缓存
- add/update/delete 后自动失效对应缓存
- refreshCache() 用于手动刷新全部缓存

### 3.6 权限标识

| 权限标识 | 说明 |
|----------|------|
| `business:config:list` | 查看参数列表 |
| `business:config:query` | 查看参数详情 |
| `business:config:add` | 新增参数 |
| `business:config:edit` | 修改参数 |
| `business:config:delete` | 删除参数 |

---

## 4. 前端实现

### 4.1 文件结构

```
frontend/src/pages/Business/
└── ConfigList.tsx
```

### 4.2 页面结构

- **顶部标题区**: 页面标题 + 刷新按钮 + 新增按钮
- **搜索栏**: 参数名称/参数键/分组类型筛选 + 搜索/重置按钮
- **数据表格**: 参数列表 (支持分页、排序、批量操作)
- **编辑对话框**: 新增/编辑参数表单

### 4.3 表格列定义

| 列名 | 字段 | 宽度 | 说明 |
|------|------|------|------|
| ID | configId | 80 | - |
| 参数名称 | configName | 150 | - |
| 参数键 | configKey | 180 | - |
| 参数值 | configValue | 200 | 支持编辑状态 |
| 分组类型 | configType | 100 | Chip 展示 |
| 描述 | description | 180 | - |
| 状态 | status | 80 | Chip 展示 (启用/禁用) |
| 可编辑 | isEditable | 80 | Chip 展示 (是/否) |
| 创建时间 | createTime | 160 | - |
| 操作 | actions | 180 | 编辑/删除按钮 |

### 4.4 表单字段

| 字段 | 类型 | 必填 | 验证规则 |
|------|------|------|----------|
| 参数名称 | TextField | 是 | max 100 字符 |
| 参数键 | TextField | 是 | max 50 字符，格式如 `sys.user.register` |
| 参数值 | TextField | 否 | max 500 字符 |
| 分组类型 | TextField | 否 | max 50 字符 |
| 描述 | TextField (multiline) | 否 | max 255 字符 |
| 是否可编辑 | Switch | - | default true |
| 状态 | Switch | - | default true |

### 4.5 交互逻辑

1. **列表加载**: 支持分页、条件筛选
2. **新增**: 打开表单对话框，验证后提交
3. **编辑**: 加载现有数据到表单，验证后提交
4. **删除**: 确认对话框后执行删除
5. **批量删除**: 选中多行后批量删除
6. **刷新**: 重新加载列表数据

---

## 5. 错误处理

### 5.1 后端验证

- 参数名称/键不能为空
- 参数键必须唯一
- 参数键格式建议：`模块。功能。子功能`
- 参数值不能超过 500 字符

### 5.2 前端验证

- 表单字段必填验证
- 字符长度验证
- 参数键格式验证 (建议用小写字母和点号)

### 5.3 异常处理

- 参数键重复：返回"参数键已存在"
- 参数不存在：返回 404
- 无权限操作：返回 403

---

## 6. 测试计划

### 6.1 后端测试

- 新增参数测试 (正常/异常场景)
- 修改参数测试
- 删除参数测试 (单个/批量)
- 参数值查询测试
- 分页查询测试 (含筛选条件)

### 6.2 前端测试

- 列表加载测试
- 新增表单测试
- 编辑表单测试
- 删除确认测试
- 搜索筛选测试
- 分页功能测试

---

## 7. 实现任务分解

### 7.1 后端任务

1. 创建数据库表 `sys_config`
2. 创建实体类 `Config.java`
3. 创建 DTO 类 `ConfigDTO.java` 和 `ConfigQueryDTO.java`
4. 创建 Mapper 接口 `ConfigMapper.java`
5. 创建 Service 接口和实现类
6. 创建 Controller 类
7. 添加初始化数据到 SQL 脚本

### 7.2 前端任务

1. 创建页面组件 `ConfigList.tsx`
2. 更新路由配置 (已有占位)
3. 添加菜单权限数据

---

## 8. 验收标准

1. 后端接口可通过 Swagger/Knife4j 访问并测试
2. 前端页面可正常访问 `/business/config`
3. CRUD 操作全部可用
4. 权限控制正常工作
5. 初始化数据正确加载
