package com.example.maplocation;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * アプリケーションのエントリポイント。
 *
 * <p>{@link MapperScan} で MyBatis の Repository（Mapper インタフェース）を
 * 一括登録する。</p>
 */
@SpringBootApplication
@MapperScan("com.example.maplocation.repository")
public class MapLocationApplication {

    public static void main(String[] args) {
        SpringApplication.run(MapLocationApplication.class, args);
    }
}
