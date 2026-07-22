package com.example.maplocation.service;

import com.example.maplocation.dto.LocationRequest;
import com.example.maplocation.dto.LocationResponse;
import java.util.List;
import java.util.UUID;

/**
 * 地点情報のビジネスロジックを定義するサービス。
 *
 * <p>controller はこのインタフェースにのみ依存する（実装の差し替えを容易にする）。</p>
 */
public interface LocationService {

    /** 全地点を取得する。 */
    List<LocationResponse> findAll();

    /** ID を指定して取得する。存在しない場合は例外をスローする。 */
    LocationResponse findById(UUID id);

    /** 新規登録する。 */
    LocationResponse create(LocationRequest request);

    /** 更新する。存在しない場合は例外をスローする。 */
    LocationResponse update(UUID id, LocationRequest request);

    /** 削除する。存在しない場合は例外をスローする。 */
    void delete(UUID id);
}
