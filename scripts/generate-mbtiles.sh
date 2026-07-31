#!/usr/bin/env bash
#
# OpenMapTiles の標準手順を用いて、PBF から MBTiles（ベクタタイル）を生成する。
#
# 処理の流れ（OpenMapTiles 公式リポジトリの make ターゲットを利用）:
#   1. PostGIS 起動（水域・Natural Earth・湖岸線データを含む preloaded イメージ）
#   2. import-osm  : PBF を imposm3 で PostGIS へインポート
#   3. import-sql  : レイヤ定義に基づく SQL 後処理
#   4. generate-bbox-file : PBF から対象範囲(bbox)を算出
#   5. generate-tiles-pg  : PostGIS の ST_MVT() で MBTiles を生成
#
# 生成物: data/${OUTPUT_MBTILES}

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
load_env
require_docker

# 前提: PBF がダウンロード済みであること。
[ -f "${PBF_FILE}" ] || die "PBF が見つかりません: ${PBF_FILE} （先に scripts/download-map.sh を実行してください）"

output_path="${DATA_DIR}/${OUTPUT_MBTILES}"
confirm_overwrite "${output_path}"

log "OpenMapTiles ${OMT_VERSION} を準備します..."
if [ ! -d "${OMT_DIR}/.git" ]; then
  log "OpenMapTiles を取得します: ${OMT_DIR}"
  git clone --branch "${OMT_VERSION}" --depth 1 \
    https://github.com/openmaptiles/openmaptiles.git "${OMT_DIR}" \
    || die "OpenMapTiles の取得に失敗しました。"
fi

# SA・PA など標準スキーマに含まれない地物を出力するため、レイヤ定義へ追記する。
"$(dirname "${BASH_SOURCE[0]}")/patch-omt-layers.sh"

cd "${OMT_DIR}"
mkdir -p data build

# 生成対象の設定を作業ディレクトリへ反映する。
#  - area          : make が参照する地域名（PBF は data/${area}.osm.pbf を期待する）
#  - MBTILES_FILE  : 出力ファイル名（.env 内を書き換え）
#  - MIN/MAX_ZOOM  : docker-compose がシェル環境変数から取り込む
cp "${PBF_FILE}" "data/${MAP_NAME}.osm.pbf"
sed -i "s|^MBTILES_FILE=.*|MBTILES_FILE=${OUTPUT_MBTILES}|" .env
export area="${MAP_NAME}"
export MIN_ZOOM="${MIN_ZOOM:-0}"
export MAX_ZOOM="${MAX_ZOOM:-14}"

log "生成範囲: zoom ${MIN_ZOOM}〜${MAX_ZOOM}（この処理は数十分〜数時間かかることがあります）"

run_step() {
  local desc="$1"; shift
  log "==> ${desc}"
  "$@" || die "失敗しました: ${desc}"
}

run_step "既存DBコンテナの削除"                       make destroy-db
run_step "作業ディレクトリ作成"                       make init-dirs
run_step "生成物のクリーン"                           make clean
run_step "レイヤ定義からSQL/マッピング生成"           make all
run_step "PostGIS 起動(preloaded: 水域/NE/湖岸線)"    make start-db-preloaded
run_step "OSMデータのインポート(import-osm)"          make import-osm
run_step "SQL後処理(import-sql)"                      make import-sql
run_step "テーブル解析(analyze-db)"                   make analyze-db
run_step "bbox算出(generate-bbox-file)"               make generate-bbox-file
run_step "MBTiles生成(generate-tiles-pg)"             make generate-tiles-pg
run_step "PostGIS 停止"                               make stop-db

generated="${OMT_DIR}/data/${OUTPUT_MBTILES}"
[ -f "${generated}" ] || die "MBTiles の生成に失敗しました: ${generated} が存在しません。"

cp "${generated}" "${output_path}"
log "MBTiles を生成しました: ${output_path} ($(du -h "${output_path}" | cut -f1))"
log "次は scripts/start.sh または docker compose up で地図を表示できます。"
