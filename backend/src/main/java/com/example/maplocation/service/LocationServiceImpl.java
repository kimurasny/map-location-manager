package com.example.maplocation.service;

import com.example.maplocation.dto.LocationRequest;
import com.example.maplocation.dto.LocationResponse;
import com.example.maplocation.entity.Location;
import com.example.maplocation.exception.ResourceNotFoundException;
import com.example.maplocation.mapper.LocationDtoMapper;
import com.example.maplocation.repository.LocationRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * {@link LocationService} の実装。
 *
 * <p>永続化は {@link LocationRepository} に委譲し、エンティティと DTO の変換は
 * {@link LocationDtoMapper} に委譲する。更新系メソッドはトランザクション境界を張る。</p>
 */
@Service
public class LocationServiceImpl implements LocationService {

    private static final Logger log = LoggerFactory.getLogger(LocationServiceImpl.class);

    private final LocationRepository repository;
    private final LocationDtoMapper dtoMapper;

    public LocationServiceImpl(LocationRepository repository, LocationDtoMapper dtoMapper) {
        this.repository = repository;
        this.dtoMapper = dtoMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocationResponse> findAll() {
        List<Location> locations = repository.findAll();
        log.debug("地点一覧を取得しました（件数={}）", locations.size());
        return locations.stream().map(dtoMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LocationResponse findById(UUID id) {
        Location location = repository.findById(id)
                .orElseThrow(() -> notFound(id));
        return dtoMapper.toResponse(location);
    }

    @Override
    @Transactional
    public LocationResponse create(LocationRequest request) {
        OffsetDateTime now = OffsetDateTime.now();
        Location entity = new Location();
        entity.setId(UUID.randomUUID());
        entity.setTitle(request.title());
        entity.setDescription(request.description());
        entity.setLatitude(request.latitude());
        entity.setLongitude(request.longitude());
        entity.setCreatedAt(now);
        entity.setUpdatedAt(now);

        repository.insert(entity);
        log.info("地点を登録しました（id={}, title={}）", entity.getId(), entity.getTitle());
        return dtoMapper.toResponse(entity);
    }

    @Override
    @Transactional
    public LocationResponse update(UUID id, LocationRequest request) {
        Location entity = repository.findById(id)
                .orElseThrow(() -> notFound(id));

        entity.setTitle(request.title());
        entity.setDescription(request.description());
        entity.setLatitude(request.latitude());
        entity.setLongitude(request.longitude());
        entity.setUpdatedAt(OffsetDateTime.now());

        repository.update(entity);
        log.info("地点を更新しました（id={}）", id);
        return dtoMapper.toResponse(entity);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        int deleted = repository.deleteById(id);
        if (deleted == 0) {
            throw notFound(id);
        }
        log.info("地点を削除しました（id={}）", id);
    }

    private ResourceNotFoundException notFound(UUID id) {
        return new ResourceNotFoundException("指定された地点が見つかりません（id=" + id + "）");
    }
}
