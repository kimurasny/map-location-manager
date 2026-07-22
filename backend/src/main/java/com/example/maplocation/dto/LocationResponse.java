package com.example.maplocation.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * 地点情報のレスポンス DTO。
 *
 * <p>OpenAPI の {@code Location} スキーマに対応する。
 * エンティティを外部公開用に変換した不変オブジェクト。</p>
 *
 * @param id          地点ID
 * @param title       タイトル
 * @param description 説明（任意・null 可）
 * @param latitude    緯度
 * @param longitude   経度
 * @param createdAt   作成日時
 * @param updatedAt   更新日時
 */
public record LocationResponse(
        UUID id,
        String title,
        String description,
        Double latitude,
        Double longitude,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
