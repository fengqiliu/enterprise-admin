package com.enterprise;

import java.sql.*;

/**
 * SQLite 数据库初始化工具
 */
public class DatabaseInitializer {
    public static void main(String[] args) throws Exception {
        Class.forName("org.sqlite.JDBC");
        String url = "jdbc:sqlite:./data/enterprise_admin.db";

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement()) {

            // 读取并执行 SQL 脚本
            java.nio.file.Path sqlPath = java.nio.file.Paths.get("src/main/resources/sql/init-sqlite.sql");
            String sqlScript = new String(java.nio.file.Files.readAllBytes(sqlPath));

            // 分割 SQL 语句（按分号分隔）
            String[] sqlStatements = sqlScript.split(";");

            for (String sql : sqlStatements) {
                String trimmed = sql.trim();
                if (!trimmed.isEmpty() && !trimmed.startsWith("--")) {
                    try {
                        stmt.execute(trimmed);
                    } catch (SQLException e) {
                        // 忽略已存在的表错误
                        if (!e.getMessage().contains("already exists")) {
                            System.err.println("Error executing: " + trimmed.substring(0, Math.min(50, trimmed.length())) + "...");
                            System.err.println("Message: " + e.getMessage());
                        }
                    }
                }
            }

            System.out.println("Database initialized successfully!");

            // 验证 sys_config 表
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM sys_config");
            if (rs.next()) {
                System.out.println("sys_config table contains " + rs.getInt(1) + " records");
            }
        }
    }
}
