package com.example.maplocation.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * springdoc-openapi のメタ情報設定。
 *
 * <p>実行時に {@code /swagger-ui.html} と {@code /v3/api-docs} を提供する。
 * API の唯一の仕様は {@code docs/openapi.yaml} だが、実装側でも同等のメタ情報を提示する。</p>
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI mapLocationOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Map Location Manager API")
                .description("地図上の地点情報を管理するAPI")
                .version("1.0.0")
                .contact(new Contact().name("Map Location Manager")));
    }
}
