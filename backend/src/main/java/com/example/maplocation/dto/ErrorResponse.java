package com.example.maplocation.dto;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * エラー応答の共通フォーマット。
 *
 * <p>OpenAPI の {@code ErrorResponse} スキーマに対応する。</p>
 *
 * @param timestamp   発生日時
 * @param status      HTTP ステータスコード
 * @param error       エラー種別
 * @param message     エラーメッセージ
 * @param fieldErrors フィールド単位のバリデーションエラー（無い場合は null）
 */
public record ErrorResponse(
        OffsetDateTime timestamp,
        int status,
        String error,
        String message,
        List<FieldErrorDetail> fieldErrors
) {

    /**
     * フィールドエラーを持たないエラー応答を生成する。
     */
    public static ErrorResponse of(int status, String error, String message) {
        return new ErrorResponse(OffsetDateTime.now(), status, error, message, null);
    }

    /**
     * フィールド単位のバリデーションエラー詳細。
     *
     * @param field   対象フィールド名
     * @param message エラー内容
     */
    public record FieldErrorDetail(String field, String message) {
    }
}
