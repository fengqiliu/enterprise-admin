-- ============================================
-- 企业后台管理系统 - SQLite 数据库初始化脚本
-- ============================================

-- ============================================
-- 用户表
-- ============================================
DROP TABLE IF EXISTS sys_user_role;
DROP TABLE IF EXISTS sys_role_menu;
DROP TABLE IF EXISTS sys_operation_log;
DROP TABLE IF EXISTS sys_login_log;
DROP TABLE IF EXISTS sys_dict_item;
DROP TABLE IF EXISTS sys_dict;
DROP TABLE IF EXISTS sys_menu;
DROP TABLE IF EXISTS sys_department;
DROP TABLE IF EXISTS sys_role;
DROP TABLE IF EXISTS sys_user;

CREATE TABLE sys_user (
    user_id INTEGER PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    gender INTEGER DEFAULT 2,
    status INTEGER DEFAULT 1,
    dept_id INTEGER DEFAULT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- ============================================
-- 角色表
-- ============================================
CREATE TABLE sys_role (
    role_id INTEGER PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    role_code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) DEFAULT NULL,
    status INTEGER DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- ============================================
-- 菜单表
-- ============================================
CREATE TABLE sys_menu (
    menu_id INTEGER PRIMARY KEY,
    parent_id INTEGER DEFAULT 0,
    menu_name VARCHAR(50) NOT NULL,
    menu_type INTEGER DEFAULT 1,
    path VARCHAR(200) DEFAULT NULL,
    component VARCHAR(200) DEFAULT NULL,
    permission VARCHAR(100) DEFAULT NULL,
    icon VARCHAR(50) DEFAULT NULL,
    sort_order INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- ============================================
-- 部门表
-- ============================================
CREATE TABLE sys_department (
    dept_id INTEGER PRIMARY KEY,
    parent_id INTEGER DEFAULT 0,
    dept_name VARCHAR(50) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- ============================================
-- 用户角色关联表
-- ============================================
CREATE TABLE sys_user_role (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

-- ============================================
-- 角色菜单关联表
-- ============================================
CREATE TABLE sys_role_menu (
    role_id INTEGER NOT NULL,
    menu_id INTEGER NOT NULL,
    PRIMARY KEY (role_id, menu_id)
);

-- ============================================
-- 操作日志表
-- ============================================
CREATE TABLE sys_operation_log (
    log_id INTEGER PRIMARY KEY,
    user_id INTEGER DEFAULT NULL,
    username VARCHAR(50) DEFAULT NULL,
    operation VARCHAR(100) DEFAULT NULL,
    method VARCHAR(200) DEFAULT NULL,
    params TEXT,
    ip VARCHAR(50) DEFAULT NULL,
    time INTEGER DEFAULT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 登录日志表
-- ============================================
CREATE TABLE sys_login_log (
    log_id INTEGER PRIMARY KEY,
    user_id INTEGER DEFAULT NULL,
    username VARCHAR(50) DEFAULT NULL,
    ip VARCHAR(50) DEFAULT NULL,
    location VARCHAR(255) DEFAULT NULL,
    browser VARCHAR(100) DEFAULT NULL,
    os VARCHAR(100) DEFAULT NULL,
    status INTEGER DEFAULT 1,
    message VARCHAR(255) DEFAULT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 数据字典表
-- ============================================
CREATE TABLE sys_dict (
    dict_id INTEGER PRIMARY KEY,
    dict_name VARCHAR(50) NOT NULL,
    dict_type VARCHAR(50) NOT NULL UNIQUE,
    remark VARCHAR(255) DEFAULT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- ============================================
-- 字典数据表
-- ============================================
CREATE TABLE sys_dict_item (
    item_id INTEGER PRIMARY KEY,
    dict_id INTEGER NOT NULL,
    item_label VARCHAR(50) NOT NULL,
    item_value VARCHAR(50) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- ============================================
-- 初始化数据
-- ============================================

-- 初始化超级管理员账号 (密码：admin123)
INSERT INTO sys_user (user_id, username, password, nickname, email, phone, gender, status) VALUES
(1, 'admin', '$2a$10$Ha1T6LU7xt8769koiaAidOUzd0h9gSpNjoyU6vZ9XXMr05MOO6um.', '超级管理员', 'admin@example.com', '13800138000', 1, 1);

-- 初始化角色
INSERT INTO sys_role (role_id, role_name, role_code, description, status) VALUES
(1, '超级管理员', 'super_admin', '系统超级管理员，拥有所有权限', 1),
(2, '普通管理员', 'admin', '普通管理员，拥有部分权限', 1),
(3, '普通用户', 'user', '普通用户，只有基本权限', 1);

-- 初始化部门
INSERT INTO sys_department (dept_id, parent_id, dept_name, sort_order, status) VALUES
(1, 0, '总公司', 1, 1),
(2, 1, '技术部', 1, 1),
(3, 1, '市场部', 2, 1),
(4, 1, '销售部', 3, 1),
(5, 1, '财务部', 4, 1);

-- 初始化用户角色关联
INSERT INTO sys_user_role (user_id, role_id) VALUES (1, 1);

-- 初始化菜单
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (1, 0, '系统管理', 1, '/system', NULL, NULL, 'Settings', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (2, 1, '用户管理', 2, '/system/user', 'system/UserList', 'system:user:list', 'People', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (3, 2, '用户查询', 3, NULL, NULL, 'system:user:query', NULL, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (4, 2, '用户新增', 3, NULL, NULL, 'system:user:add', NULL, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (5, 2, '用户修改', 3, NULL, NULL, 'system:user:edit', NULL, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (6, 2, '用户删除', 3, NULL, NULL, 'system:user:delete', NULL, 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (7, 1, '角色管理', 2, '/system/role', 'system/RoleList', 'system:role:list', 'Security', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (8, 1, '菜单管理', 2, '/system/menu', 'system/MenuList', 'system:menu:list', 'Assignment', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (9, 1, '部门管理', 2, '/system/department', 'system/DepartmentList', 'system:dept:list', 'FolderShared', 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (10, 0, '业务管理', 1, '/business', NULL, NULL, 'Assignment', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (11, 10, '数据字典', 2, '/business/dict', 'business/DictList', 'business:dict:list', 'Description', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (12, 10, '参数配置', 2, '/business/config', 'business/ConfigList', 'business:config:list', 'Storage', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (13, 0, '日志中心', 1, '/log', NULL, NULL, 'History', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (14, 13, '操作日志', 2, '/log/operation', 'log/OperationLog', 'log:operation:list', 'Assignment', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (15, 13, '登录日志', 2, '/log/login', 'log/LoginLog', 'log:login:list', 'Security', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_menu (menu_id, parent_id, menu_name, menu_type, path, component, permission, icon, sort_order, status, create_time, update_time, deleted) VALUES (16, 0, '仪表盘', 2, '/dashboard', 'Dashboard', NULL, 'Dashboard', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- 初始化角色菜单关联（超级管理员拥有所有菜单权限）
INSERT INTO sys_role_menu (role_id, menu_id) SELECT 1, menu_id FROM sys_menu;

-- 初始化数据字典
INSERT INTO sys_dict (dict_id, dict_name, dict_type, remark, create_time, update_time, deleted) VALUES (1, '性别字典', 'gender', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_dict (dict_id, dict_name, dict_type, remark, create_time, update_time, deleted) VALUES (2, '状态字典', 'status', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_dict (dict_id, dict_name, dict_type, remark, create_time, update_time, deleted) VALUES (3, '用户类型字典', 'user_type', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

INSERT INTO sys_dict_item (item_id, dict_id, item_label, item_value, sort_order, status, create_time, update_time, deleted) VALUES (1, 1, '女', '0', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_dict_item (item_id, dict_id, item_label, item_value, sort_order, status, create_time, update_time, deleted) VALUES (2, 1, '男', '1', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_dict_item (item_id, dict_id, item_label, item_value, sort_order, status, create_time, update_time, deleted) VALUES (3, 1, '未知', '2', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_dict_item (item_id, dict_id, item_label, item_value, sort_order, status, create_time, update_time, deleted) VALUES (4, 2, '禁用', '0', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
INSERT INTO sys_dict_item (item_id, dict_id, item_label, item_value, sort_order, status, create_time, update_time, deleted) VALUES (5, 2, '启用', '1', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
