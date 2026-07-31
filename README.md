# 地点情報マネージャー（Map Location Manager）

地図上をクリックして地点を登録し、地点ごとにテキスト情報（タイトル・説明）を
保存・閲覧・編集・削除できる Web アプリケーションです。

地図タイルは外部サービスに依存せず、OpenStreetMap の日本データ（Geofabrik）から
**OpenMapTiles** の標準手順で MBTiles を生成し、Docker 上の **TileServer GL** で
自前配信します。既定の対象地域は**関東**で、`.env` の変更だけで日本全体へ切り替えられます。

---

## 主な機能

- 地図表示（起動時に表示）
- 地図クリックによる地点登録（緯度・経度を取得しマーカー表示 → フォーム入力 → 保存）
- 保存済みデータの一覧マーカー表示
- マーカークリックによる詳細表示（サイドパネル）
- 地点の編集
- 確認ダイアログ付きの削除

---

## 技術スタック

| 層 | 採用技術 |
| --- | --- |
| フロントエンド | React 19 / TypeScript / Vite / React Router / MapLibre GL JS / React Query（TanStack Query） / React Hook Form / Zod / OpenAPI Generator |
| 地図 | OpenStreetMap / OpenMapTiles / TileServer GL（Docker） / MapLibre GL JS（ベクタタイル描画） |
| バックエンド | Spring Boot 3.x / Java 21 / Gradle / MyBatis / PostgreSQL / Flyway / springdoc-openapi |
| インフラ | Docker Compose |

---

## ディレクトリ構成

```
map-location-manager/
├── README.md
├── docker-compose.yml          # frontend / backend / postgres / tileserver
├── docs/
│   └── openapi.yaml            # 唯一のAPI仕様（Single Source of Truth）
├── backend/                    # Spring Boot（レイヤードアーキテクチャ）
│   ├── build.gradle
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/example/maplocation/
│       │   ├── controller/     # REST エンドポイント
│       │   ├── service/        # 業務ロジック
│       │   ├── repository/     # MyBatis Mapper インタフェース
│       │   ├── entity/         # DB エンティティ
│       │   ├── dto/            # 入出力 DTO
│       │   ├── mapper/         # entity <-> dto 変換
│       │   ├── config/         # CORS / OpenAPI 設定
│       │   └── exception/      # 例外と共通ハンドラ
│       └── resources/
│           ├── application.yml
│           ├── db/migration/   # Flyway マイグレーション（DDL / 初期データ）
│           └── mybatis/mapper/ # MyBatis XML
├── frontend/                   # React（機能単位で整理）
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── api/                # OpenAPI Generator 生成物 + クライアント設定
│       ├── components/         # 汎用 UI コンポーネント
│       ├── features/location/  # 地点機能（地図・フォーム・詳細）
│       ├── hooks/              # React Query フック
│       ├── layouts/           # レイアウト
│       ├── pages/             # 画面
│       ├── types/            # 型（生成型の再エクスポート）
│       └── utils/            # ユーティリティ
├── scripts/                    # 地図データのダウンロード・生成・起動・削除
│   ├── download-map.sh        # PBF ダウンロード
│   ├── generate-mbtiles.sh    # OpenMapTiles で MBTiles 生成
│   ├── patch-omt-layers.sh    # SA・PA 出力のためのレイヤ定義追記
│   ├── start.sh               # docker compose 起動
│   ├── clean.sh               # 生成物削除
│   └── lib.sh                 # 共通処理（.env 読込・チェック）
├── data/                       # 生成物（PBF / MBTiles）※ git 管理外
└── .env                        # 地図データ生成の設定（MAP_NAME / PBF_URL / OUTPUT_MBTILES）
```

---

## 地図データの準備と起動

地図（MBTiles）はサイズが大きいためリポジトリに含めていません。
**初回のみ** OpenStreetMap の日本データをダウンロードして MBTiles を生成します。

### 初回手順

```bash
# 1. PBF（OSM生データ）を Geofabrik からダウンロード（既定: 関東）
./scripts/download-map.sh

# 2. OpenMapTiles の標準手順で MBTiles を生成（PostGIS→import→bbox→タイル生成）
./scripts/generate-mbtiles.sh

# 3. 全サービスを起動
docker compose up --build
#   もしくは: ./scripts/start.sh --build
```

生成された `data/kanto.mbtiles` を TileServer GL が読み込み、ベクタタイルとして配信します。
フロントエンドは MapLibre GL JS でベクタタイルを直接描画し、スタイル定義は
`frontend/src/features/location/mapStyle.ts` に持ちます（TileServer GL 同梱の
ラスタスタイル `basic-preview` は使用しません）。

| サービス | URL | 説明 |
| --- | --- | --- |
| frontend | http://localhost:3000 | アプリ本体 |
| backend | http://localhost:8080 | REST API |
| backend（Swagger UI） | http://localhost:8080/swagger-ui.html | API ドキュメント |
| tileserver | http://localhost:8081 | 地図（日本地図） |
| postgres | localhost:5432 | DB（maplocation / maplocation） |

起動後、`http://localhost:3000` を開くとアプリが、`http://localhost:8081` を開くと
TileServer GL の地図ビューア（日本地図）が表示されます。
初期データ（東京近郊の 3 地点）が登録済みです。

> **ポートについて**: `http://localhost:8080` は backend（REST API）が使用します。
> 地図の TileServer GL は `http://localhost:8081` で配信します。

### 対象地域の更新・切り替え

`.env` を編集して対象地域を変更し、再生成します。

```bash
# .env を編集（例: 関東 → 日本全体）
#   MAP_NAME=japan
#   PBF_URL=https://download.geofabrik.de/asia/japan-latest.osm.pbf
#   OUTPUT_MBTILES=japan.mbtiles

./scripts/clean.sh            # 既存の生成物を削除
./scripts/download-map.sh     # 新しい PBF をダウンロード
./scripts/generate-mbtiles.sh # MBTiles を再生成
docker compose up --build
```

ズームの詳細度は `.env` の `MIN_ZOOM` / `MAX_ZOOM` で調整できます
（既定 0〜14。値を大きくすると詳細になりますが容量・生成時間が増えます）。
ベクタタイルは MapLibre GL がオーバーズームして描画するため、`MAX_ZOOM=14` のままでも
ズーム 15 以上で地図・ラベルを表示できます（タイルの再生成は不要です）。

---

## 地図の表示内容（道路・鉄道・地名ラベル）

`frontend/src/features/location/mapStyle.ts` で、OpenMapTiles v3 スキーマの
以下のレイヤを描画しています。ラベルは `name:ja` を優先し、無い場合は `name` を表示します。

| 表示項目 | 参照レイヤ / 条件 | 表示ズーム |
| --- | --- | --- |
| 高速道路 | `transportation` `class=motorway` | 全ズーム（線幅はズームで変化） |
| 国道・主要道 | `transportation` `class=trunk/primary/secondary/tertiary` | 全ズーム |
| 道路番号 | `transportation_name` の `ref` | 10 以上 |
| 道路名 | `transportation_name` の `name` | 13 以上 |
| IC・JCT 名 | `transportation_name` `subclass=junction` | 12 以上 |
| SA・PA 名 | `poi` `subclass=services/rest_area`（後述のレイヤ拡張が必要） | 12 以上 |
| 鉄道路線 | `transportation` `class=rail/transit` | 8 以上 |
| 鉄道路線名・駅名 | `transportation_name` `class=rail/transit`、`poi` `subclass=station` | 11 / 13 以上 |
| 市区町村名 | `place` `class=city/town/village` | 全ズーム |
| 地名（丁目・地区など） | `place` `class=suburb/quarter/neighbourhood/hamlet` | 12 以上 |
| 河川名 | `waterway`（`class=river/canal`）、`water_name` | 11 以上 |
| 公園名 | `park` の `name` | 11 以上 |

日本語（CJK）のグリフは TileServer GL 同梱フォントに含まれないため、MapLibre GL の
`localIdeographFontFamily` によりブラウザのローカルフォントで描画します。

### SA・PA 表示のためのレイヤ拡張

OpenMapTiles の標準スキーマには SA・PA（OSM の `highway=services` / `highway=rest_area`）が
含まれないため、`scripts/patch-omt-layers.sh` が `poi` レイヤの定義へこれらのタグを追記します
（`scripts/generate-mbtiles.sh` から自動で呼ばれます）。既存の MBTiles に SA・PA を反映するには
MBTiles の再生成が必要です。

IC・JCT（`highway=motorway_junction`）は標準スキーマの `transportation_name` レイヤに
含まれるため、拡張なしで表示できます。

### 地図表示に関する環境変数（frontend）

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `VITE_TILE_JSON_URL` | `http://localhost:8081/data/v3.json` | ベクタタイルの TileJSON URL（OpenMapTiles の MBTiles は名前に関係なく `/data/v3.json` で配信される） |
| `VITE_GLYPHS_URL` | `http://localhost:8081/fonts/{fontstack}/{range}.pbf` | ラベル用フォントの URL テンプレート |

### 必要ディスク容量・処理時間の目安

| 対象 | PBF サイズ | 生成 MBTiles | 目安時間(8コア想定) | 必要ディスク |
| --- | --- | --- | --- | --- |
| 関東（kanto） | 約 450MB | 数百MB〜 | 数十分程度 | 10GB 以上の空き |
| 日本全体（japan） | 約 1.7GB | 数GB | 数時間 | 30GB 以上の空き |

> 生成には OpenMapTiles / PostGIS の Docker イメージ（合計数GB）を取得します。
> メモリは 8GB 以上（日本全体は 16GB 以上）を推奨します。

### 日本全体へ変更する方法（まとめ）

`.env` を次のように変更し、上記「対象地域の更新・切り替え」の手順を実行します。

```dotenv
MAP_NAME=japan
PBF_URL=https://download.geofabrik.de/asia/japan-latest.osm.pbf
OUTPUT_MBTILES=japan.mbtiles
```

---

## API 仕様

- **唯一の API 仕様**は [`docs/openapi.yaml`](docs/openapi.yaml) です。
- フロントエンドは OpenAPI Generator で生成したクライアント（`frontend/src/api/generated`）
  のみを使用します（**手書き fetch は禁止**）。
- API クライアントの再生成:

  ```bash
  cd frontend
  npm run generate:api
  ```

### エンドポイント

| メソッド | パス | 説明 |
| --- | --- | --- |
| GET | `/api/locations` | 一覧取得 |
| POST | `/api/locations` | 新規登録 |
| GET | `/api/locations/{id}` | 詳細取得 |
| PUT | `/api/locations/{id}` | 更新 |
| DELETE | `/api/locations/{id}` | 削除 |

---

## DB 設計

Flyway で DDL を管理します（`backend/src/main/resources/db/migration`）。

### `location` テーブル

| 項目 | 型 |
| --- | --- |
| id | UUID（PK） |
| title | varchar(100) |
| description | text |
| latitude | double precision |
| longitude | double precision |
| created_at | timestamptz |
| updated_at | timestamptz |

---

## ローカル開発（Docker を使わない場合）

### バックエンド

```bash
cd backend
./gradlew bootRun    # 事前に PostgreSQL を起動しておくこと
./gradlew test       # テスト
```

Java 21 が必要です。DB 接続情報は環境変数 `SPRING_DATASOURCE_URL` /
`SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` で上書きできます。

### フロントエンド

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173（/api はバックエンドへプロキシ）
npm run lint         # ESLint
npm run typecheck    # 型チェック
npm run build        # 本番ビルド
```

---

## 設計方針

保守性・拡張性・可読性・型安全・AI による継続開発のしやすさを重視しています。

- **バックエンド**: レイヤードアーキテクチャ（controller → service → repository）。
  Controller から Repository を直接呼び出しません。例外は共通ハンドラで統一フォーマットに変換します。
- **フロントエンド**: サーバー状態は React Query が単一の情報源として管理し、`useState`
  では保持しません。フォームは React Hook Form + Zod で検証します。API 呼び出しは
  生成クライアント経由のみです。
- **API ファースト**: OpenAPI を先に定義し、フロント・バックの双方が従います。
- **UI / アクセシビリティ**: デジタル庁デザインシステム（DADS β版）のガイドラインを参考に、
  配色・余白・フォーカス表示・フォーム設計を整えています（WCAG 2.2 AA を意識）。

### 将来の拡張（設計上の考慮点）

以下の追加を見据えて、地図機能（`features/location`）とアイコン定義、環境変数による
設定切り替えを分離しています。

- アイコン種類の追加 / カテゴリ管理 / 検索・フィルタ / レイヤー切替
- GeoJSON 入出力 / CSV インポート・エクスポート / 画像添付
- 複数ユーザー対応 / 権限管理 / クラスタリング / オフライン対応
