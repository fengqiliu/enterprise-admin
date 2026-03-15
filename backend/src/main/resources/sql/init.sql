-- ============================================
-- 企业后台管理系统 - 数据库初始化脚本
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `enterprise_admin` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `enterprise_admin`;

-- ============================================
-- 用户表
-- ============================================
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
    `user_id` BIGINT NOT NULL COMMENT '用户 ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `password` VARCHAR(100) NOT NULL COMMENT '密码',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像',
    `gender` TINYINT DEFAULT 2 COMMENT '性别 0-女 1-男 2-未知',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    `dept_id` BIGINT DEFAULT NULL COMMENT '部门 ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ============================================
-- 角色表
-- ============================================
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
    `role_id` BIGINT NOT NULL COMMENT '角色 ID',
    `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称',
    `role_code` VARCHAR(50) NOT NULL COMMENT '角色编码',
    `description` VARCHAR(255) DEFAULT NULL COMMENT '描述',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`role_id`),
    UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- ============================================
-- 菜单表
-- ============================================
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
    `menu_id` BIGINT NOT NULL COMMENT '菜单 ID',
    `parent_id` BIGINT DEFAULT 0 COMMENT '父菜单 ID',
    `menu_name` VARCHAR(50) NOT NULL COMMENT '菜单名称',
    `menu_type` TINYINT DEFAULT 1 COMMENT '菜单类型 1-目录 2-菜单 3-按钮',
    `path` VARCHAR(200) DEFAULT NULL COMMENT '路由路径',
    `component` VARCHAR(200) DEFAULT NULL COMMENT '组件路径',
    `permission` VARCHAR(100) DEFAULT NULL COMMENT '权限标识',
    `icon` VARCHAR(50) DEFAULT NULL COMMENT '图标',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单表';

-- ============================================
-- 部门表
-- ============================================
DROP TABLE IF EXISTS `sys_department`;
CREATE TABLE `sys_department` (
    `dept_id` BIGINT NOT NULL COMMENT '部门 ID',
    `parent_id` BIGINT DEFAULT 0 COMMENT '父部门 ID',
    `dept_name` VARCHAR(50) NOT NULL COMMENT '部门名称',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- ============================================
-- 用户角色关联表
-- ============================================
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
    `user_id` BIGINT NOT NULL COMMENT '用户 ID',
    `role_id` BIGINT NOT NULL COMMENT '角色 ID',
    PRIMARY KEY (`user_id`, `role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- ============================================
-- 角色菜单关联表
-- ============================================
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
    `role_id` BIGINT NOT NULL COMMENT '角色 ID',
    `menu_id` BIGINT NOT NULL COMMENT '菜单 ID',
    PRIMARY KEY (`role_id`, `menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- ============================================
-- 操作日志表
-- ============================================
DROP TABLE IF EXISTS `sys_operation_log`;
CREATE TABLE `sys_operation_log` (
    `log_id` BIGINT NOT NULL COMMENT '日志 ID',
    `user_id` BIGINT DEFAULT NULL COMMENT '用户 ID',
    `username` VARCHAR(50) DEFAULT NULL COMMENT '用户名',
    `operation` VARCHAR(100) DEFAULT NULL COMMENT '操作',
    `method` VARCHAR(200) DEFAULT NULL COMMENT '请求方法',
    `params` TEXT COMMENT '请求参数',
    `ip` VARCHAR(50) DEFAULT NULL COMMENT 'IP 地址',
    `time` BIGINT DEFAULT NULL COMMENT '执行时长 (ms)',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- ============================================
-- 登录日志表
-- ============================================
DROP TABLE IF EXISTS `sys_login_log`;
CREATE TABLE `sys_login_log` (
    `log_id` BIGINT NOT NULL COMMENT '日志 ID',
    `user_id` BIGINT DEFAULT NULL COMMENT '用户 ID',
    `username` VARCHAR(50) DEFAULT NULL COMMENT '用户名',
    `ip` VARCHAR(50) DEFAULT NULL COMMENT 'IP 地址',
    `location` VARCHAR(255) DEFAULT NULL COMMENT '登录地点',
    `browser` VARCHAR(100) DEFAULT NULL COMMENT '浏览器',
    `os` VARCHAR(100) DEFAULT NULL COMMENT '操作系统',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0-失败 1-成功',
    `message` VARCHAR(255) DEFAULT NULL COMMENT '提示信息',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='登录日志表';

-- ============================================
-- 数据字典表
-- ============================================
DROP TABLE IF EXISTS `sys_dict`;
CREATE TABLE `sys_dict` (
    `dict_id` BIGINT NOT NULL COMMENT '字典 ID',
    `dict_name` VARCHAR(50) NOT NULL COMMENT '字典名称',
    `dict_type` VARCHAR(50) NOT NULL COMMENT '字典类型',
    `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`dict_id`),
    UNIQUE KEY `uk_dict_type` (`dict_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典表';

-- ============================================
-- 字典数据表
-- ============================================
DROP TABLE IF EXISTS `sys_dict_item`;
CREATE TABLE `sys_dict_item` (
    `item_id` BIGINT NOT NULL COMMENT '字典项 ID',
    `dict_id` BIGINT NOT NULL COMMENT '字典 ID',
    `item_label` VARCHAR(50) NOT NULL COMMENT '字典标签',
    `item_value` VARCHAR(50) NOT NULL COMMENT '字典值',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典数据表';

-- ============================================
-- 初始化数据
-- ============================================

-- 初始化超级管理员账号 (密码：admin123)
INSERT INTO `sys_user` (`user_id`, `username`, `password`, `nickname`, `email`, `phone`, `gender`, `status`) VALUES
(1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lqkkO9QS3TzCjH3rS', '超级管理员', 'admin@example.com', '13800138000', 1, 1);

-- 初始化角色
INSERT INTO `sys_role` (`role_id`, `role_name`, `role_code`, `description`, `status`) VALUES
(1, '超级管理员', 'super_admin', '系统超级管理员，拥有所有权限', 1),
(2, '普通管理员', 'admin', '普通管理员，拥有部分权限', 1),
(3, '普通用户', 'user', '普通用户，只有基本权限', 1);

-- 初始化部门
INSERT INTO `sys_department` (`dept_id`, `parent_id`, `dept_name`, `sort_order`, `status`) VALUES
(1, 0, '总公司', 1, 1),
(2, 1, '技术部', 1, 1),
(3, 1, '市场部', 2, 1),
(4, 1, '销售部', 3, 1),
(5, 1, '财务部', 4, 1);

-- 初始化用户角色关联
INSERT INTO `sys_user_role` (`user_id`, `role_id`) VALUES (1, 1);

-- 初始化菜单
INSERT INTO `sys_menu` (`menu_id`, `parent_id`, `menu_name`, `menu_type`, `path`, `component`, `permission`, `icon`, `sort_order`, `status`) VALUES
(1, 0, '系统管理', 1, '/system', NULL, NULL, 'Settings', 1, 1),
(2, 1, '用户管理', 2, '/system/user', 'system/UserList', 'system:user:list', 'People', 1, 1),
(3, 2, '用户查询', 3, NULL, NULL, 'system:user:query', NULL, 1, 1),
(4, 2, '用户新增', 3, NULL, NULL, 'system:user:add', NULL, 2, 1),
(5, 2, '用户修改', 3, NULL, NULL, 'system:user:edit', NULL, 3, 1),
(6, 2, '用户删除', 3, NULL, NULL, 'system:user:delete', NULL, 4, 1),
(7, 1, '角色管理', 2, '/system/role', 'system/RoleList', 'system:role:list', 'Security', 2, 1),
(8, 1, '菜单管理', 2, '/system/menu', 'system/MenuList', 'system:menu:list', 'Assignment', 3, 1),
(9, 1, '部门管理', 2, '/system/department', 'system/DepartmentList', 'system:dept:list', 'FolderShared', 4, 1),
(10, 0, '业务管理', 1, '/business', NULL, NULL, NULL, 'Assignment', 2, 1),
(11, 10, '数据字典', 2, '/business/dict', 'business/DictList', 'business:dict:list', 'Description', 1, 1),
(12, 10, '参数配置', 2, '/business/config', 'business/ConfigList', 'business:config:list', 'Storage', 2, 1),
(13, 0, '日志中心', 1, '/log', NULL, NULL, NULL, 'History', 3, 1),
(14, 13, '操作日志', 2, '/log/operation', 'log/OperationLog', 'log:operation:list', 'Assignment', 1, 1),
(15, 13, '登录日志', 2, '/log/login', 'log/LoginLog', 'log:login:list', 'Security', 2, 1),
(16, 0, '仪表盘', 2, '/dashboard', 'Dashboard', NULL, 'Dashboard', 0, 1);

-- 初始化角色菜单关联（超级管理员拥有所有菜单权限）
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) 
SELECT 1, menu_id FROM `sys_menu`;

-- 初始化数据字典
INSERT INTO `sys_dict` (`dict_id`, `dict_name`, `dict_type`) VALUES
(1, '性别字典', 'gender'),
(2, '状态字典', 'status'),
(3, '用户类型字典', 'user_type');

INSERT INTO `sys_dict_item` (`item_id`, `dict_id`, `item_label`, `item_value`, `sort_order`, `status`) VALUES
(1, 1, '女', '0', 1, 1),
(2, 1, '男', '1', 2, 1),
(3, 1, '未知', '2', 3, 1),
(4, 2, '禁用', '0', 1, 1),
(5, 2, '启用', '1', 2, 1);

-- ============================================
-- 报表表
-- ============================================
DROP TABLE IF EXISTS `sys_report`;
CREATE TABLE `sys_report` (
    `report_id` BIGINT NOT NULL COMMENT '报表 ID',
    `report_name` VARCHAR(100) NOT NULL COMMENT '报表名称',
    `report_type` VARCHAR(50) NOT NULL COMMENT '报表类型',
    `description` VARCHAR(255) DEFAULT NULL COMMENT '报表描述',
    `start_date` VARCHAR(20) DEFAULT NULL COMMENT '开始日期',
    `end_date` VARCHAR(20) DEFAULT NULL COMMENT '结束日期',
    `params` TEXT DEFAULT NULL COMMENT '报表参数',
    `file_path` VARCHAR(500) DEFAULT NULL COMMENT '文件路径',
    `file_size` BIGINT DEFAULT NULL COMMENT '文件大小',
    `status` INT DEFAULT 0 COMMENT '状态：0-待生成 1-生成中 2-已完成 3-失败',
    `download_count` INT DEFAULT 0 COMMENT '下载次数',
    `create_by` BIGINT DEFAULT NULL COMMENT '创建人 ID',
    `create_name` VARCHAR(50) DEFAULT NULL COMMENT '创建人姓名',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `remark` TEXT DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (`report_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='报表表';