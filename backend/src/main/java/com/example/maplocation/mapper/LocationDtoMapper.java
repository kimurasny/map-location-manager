package com.example.maplocation.mapper;

import com.example.maplocation.dto.LocationResponse;
import com.example.maplocation.entity.Location;
import org.springframework.stereotype.Component;

/**
 * エンティティと DTO の相互変換を担うマッパー。
 *
 * <p>変換責務を専用クラスに集約することで、service 層のロジックを簡潔に保つ。</p>
 */
@Component
public class LocationDtoMapper {

    /**
     * エンティティをレスポンス DTO に変換する。
     */
    public LocationResponse toResponse(Location entity) {
        return new LocationResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getLatitude(),
                entity.getLongitude(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
