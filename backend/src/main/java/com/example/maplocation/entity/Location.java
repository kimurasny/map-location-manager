package com.example.maplocation.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * location テーブルに対応するエンティティ。
 *
 * <p>永続化層（MyBatis）とのやり取りにのみ使用し、外部へは DTO に変換して返す。
 * DB のカラムと 1:1 で対応させ、変換ロジックは持たせない（責務分離）。</p>
 */
public class Location {

    /** 地点ID（UUID・主キー）。 */
    private UUID id;

    /** タイトル。 */
    private String title;

    /** 説明（任意）。 */
    private String description;

    /** 緯度。 */
    private Double latitude;

    /** 経度。 */
    private Double longitude;

    /** 作成日時。 */
    private OffsetDateTime createdAt;

    /** 更新日時。 */
    private OffsetDateTime updatedAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
