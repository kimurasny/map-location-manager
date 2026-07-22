package com.example.maplocation.exception;

/**
 * 指定された資源（地点など）が存在しない場合にスローする例外。
 *
 * <p>{@code GlobalExceptionHandler} で 404 応答に変換される。</p>
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
