# 地点情報マネージャー（Map Location Manager）

地図上をクリックして地点を登録し、地点ごとにテキスト情報（タイトル・説明）を
保存・閲覧・編集・削除できる Web アプリケーションです。

地図タイルは外部サービスに依存せず、Docker 上の **TileServer GL**（OpenStreetMap /
OpenMapTiles 由来のデータ）で自前配信します。

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
| フロントエンド | React 19 / TypeScript / Vite / React Router / React Leaflet / React Query（TanStack Query） / React Hook Form / Zod / OpenAPI Generator |
| 地図 | OpenStreetMap / OpenMapTiles / TileServer GL（Docker） |
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
└── infra/
    └── tileserver/            # TileServer GL 設定 + データ取得スクリプト
```

---

## 起動方法（Docker Compose）

### 1. 地図データ（タイル）の取得

TileServer GL が配信する地図データはサイズが大きいためリポジトリに含めていません。
初回のみ、以下のスクリプトでスタイル・フォント・地図データ（mbtiles）を取得します。

```bash
bash infra/tileserver/download-data.sh
```

> 既定では動作確認用のサンプル（チューリッヒ周辺）を取得します。
> 他地域を表示したい場合は、対象地域の **OpenMapTiles 形式** の `.mbtiles` を
> `infra/tileserver/tiles.mbtiles` として置き換えてください。
> 表示中心は環境変数（`VITE_MAP_CENTER_LAT` / `VITE_MAP_CENTER_LNG` / `VITE_MAP_ZOOM`）で調整できます。

### 2. 起動

```bash
docker compose up --build
```

| サービス | URL | 説明 |
| --- | --- | --- |
| frontend | http://localhost:3000 | アプリ本体 |
| backend | http://localhost:8080 | REST API |
| backend（Swagger UI） | http://localhost:8080/swagger-ui.html | API ドキュメント |
| tileserver | http://localhost:8081 | 地図タイル |
| postgres | localhost:5432 | DB（maplocation / maplocation） |

起動後、`http://localhost:3000` を開くと地図が表示されます。
初期データ（東京近郊の 3 地点）が登録済みです。

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
