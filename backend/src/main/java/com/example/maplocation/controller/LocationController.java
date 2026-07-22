package com.example.maplocation.controller;

import com.example.maplocation.dto.LocationRequest;
import com.example.maplocation.dto.LocationResponse;
import com.example.maplocation.service.LocationService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 地点情報 CRUD の REST コントローラ。
 *
 * <p>HTTP と DTO の変換のみを担い、業務ロジックは {@link LocationService} に委譲する。
 * repository を直接呼び出さない（レイヤードアーキテクチャの原則）。</p>
 */
@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService service;

    public LocationController(LocationService service) {
        this.service = service;
    }

    /** 地点一覧を取得する。 */
    @GetMapping
    public List<LocationResponse> list() {
        return service.findAll();
    }

    /** 地点詳細を取得する。 */
    @GetMapping("/{id}")
    public LocationResponse get(@PathVariable UUID id) {
        return service.findById(id);
    }

    /** 地点を新規登録する（201 Created）。 */
    @PostMapping
    public ResponseEntity<LocationResponse> create(@Valid @RequestBody LocationRequest request) {
        LocationResponse created = service.create(request);
        URI location = URI.create("/api/locations/" + created.id());
        return ResponseEntity.created(location).body(created);
    }

    /** 地点を更新する。 */
    @PutMapping("/{id}")
    public LocationResponse update(@PathVariable UUID id, @Valid @RequestBody LocationRequest request) {
        return service.update(id, request);
    }

    /** 地点を削除する（204 No Content）。 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
