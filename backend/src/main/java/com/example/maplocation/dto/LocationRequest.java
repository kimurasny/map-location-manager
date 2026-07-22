package com.example.maplocation.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 地点の登録・更新リクエスト DTO。
 *
 * <p>OpenAPI の {@code LocationRequest} スキーマに対応する。
 * バリデーション制約は OpenAPI 仕様と一致させている。</p>
 *
 * @param title       タイトル（必須・1〜100文字）
 * @param description 説明（任意）
 * @param latitude    緯度（-90〜90・必須）
 * @param longitude   経度（-180〜180・必須）
 */
public record LocationRequest(

        @NotBlank(message = "タイトルは必須です")
        @Size(max = 100, message = "タイトルは100文字以内で入力してください")
        String title,

        String description,

        @NotNull(message = "緯度は必須です")
        @DecimalMin(value = "-90.0", message = "緯度は-90以上で入力してください")
        @DecimalMax(value = "90.0", message = "緯度は90以下で入力してください")
        Double latitude,

        @NotNull(message = "経度は必須です")
        @DecimalMin(value = "-180.0", message = "経度は-180以上で入力してください")
        @DecimalMax(value = "180.0", message = "経度は180以下で入力してください")
        Double longitude
) {
}
