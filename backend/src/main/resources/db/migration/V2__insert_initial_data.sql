-- 動作確認用の初期データ（東京近郊の代表的な地点）。
INSERT INTO location (id, title, description, latitude, longitude, created_at, updated_at) VALUES
    ('3f2504e0-4f89-41d3-9a0c-0305e82c3301', '東京駅',   'JR東日本・東京メトロが乗り入れる主要ターミナル駅。',        35.681236, 139.767125, now(), now()),
    ('6ba7b810-9dad-11d1-80b4-00c04fd430c8', '皇居',     '旧江戸城跡に位置する天皇の住居。',                          35.685175, 139.752799, now(), now()),
    ('9f1c8e2a-3b4d-4e5f-8a1b-2c3d4e5f6a7b', '東京スカイツリー', '高さ634mの電波塔・観光名所。',                     35.710063, 139.810700, now(), now());
