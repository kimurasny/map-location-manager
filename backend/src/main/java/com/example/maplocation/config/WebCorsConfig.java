package com.example.maplocation.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS 設定。
 *
 * <p>フロントエンド（開発時は Vite dev server、本番は Nginx 配信）からの
 * API 呼び出しを許可する。許可オリジンは環境変数 {@code APP_CORS_ALLOWED_ORIGINS}
 * で上書き可能にし、拡張性を確保する。</p>
 */
@Configuration
public class WebCorsConfig implements WebMvcConfigurer {

    private final String[] allowedOrigins;

    public WebCorsConfig(
            @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
            String[] allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
