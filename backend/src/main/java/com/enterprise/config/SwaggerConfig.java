package com.enterprise.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/Knife4j 配置类
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("企业后台管理系统 API 文档")
                .version("1.0.0")
                .description("基于 Spring Boot + Vue 的企业级后台管理系统")
                .contact(new Contact()
                    .name("Enterprise")
                    .email("admin@example.com")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Token"))
            .schemaRequirement("Bearer Token", new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .name("Authorization")
                .in(SecurityScheme.In.HEADER)
                .description("JWT Token，格式：Bearer {token}"));
    }
}