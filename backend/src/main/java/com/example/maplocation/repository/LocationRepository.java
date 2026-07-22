package com.example.maplocation.repository;

import com.example.maplocation.entity.Location;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.apache.ibatis.annotations.Param;

/**
 * location テーブルへの永続化操作を定義する MyBatis Repository（Mapper インタフェース）。
 *
 * <p>SQL は {@code mybatis/mapper/LocationRepository.xml} に定義する。
 * この層は controller から直接呼び出さず、必ず service 層を経由する。</p>
 */
public interface LocationRepository {

    /** 全地点を作成日時の降順で取得する。 */
    List<Location> findAll();

    /** ID を指定して 1 件取得する。 */
    Optional<Location> findById(@Param("id") UUID id);

    /** 新規登録する（生成済みの id・日時を含む entity を渡す）。 */
    void insert(Location location);

    /** 既存レコードを更新する。更新件数を返す。 */
    int update(Location location);

    /** ID を指定して削除する。削除件数を返す。 */
    int deleteById(@Param("id") UUID id);
}
