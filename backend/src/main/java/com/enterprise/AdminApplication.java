package com.enterprise;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * 企业后台管理系统启动类
 * @author Enterprise
 */
@SpringBootApplication
@MapperScan("com.enterprise.mapper")
@EnableAspectJAutoProxy(exposeProxy = true)
public class AdminApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminApplication.class, args);
        System.out.println("====================================");
        System.out.println("企业后台管理系统启动成功！");
        System.out.println("====================================");
    }
}