-- 地点情報テーブル。地図上に登録する地点の緯度経度とテキスト情報を保持する。
CREATE TABLE location (
    id          UUID             PRIMARY KEY,
    title       VARCHAR(100)     NOT NULL,
    description TEXT,
    latitude    DOUBLE PRECISION NOT NULL,
    longitude   DOUBLE PRECISION NOT NULL,
    created_at  TIMESTAMPTZ      NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ      NOT NULL DEFAULT now()
);

-- 一覧表示は作成日時の降順が基本のため、インデックスを付与する。
CREATE INDEX idx_location_created_at ON location (created_at DESC);

COMMENT ON TABLE location IS '地図上に登録する地点情報';
COMMENT ON COLUMN location.id IS '地点ID（UUID）';
COMMENT ON COLUMN location.title IS 'タイトル';
COMMENT ON COLUMN location.description IS '説明（任意）';
COMMENT ON COLUMN location.latitude IS '緯度';
COMMENT ON COLUMN location.longitude IS '経度';
COMMENT ON COLUMN location.created_at IS '作成日時';
COMMENT ON COLUMN location.updated_at IS '更新日時';
