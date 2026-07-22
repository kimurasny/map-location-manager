#!/usr/bin/env bash
#
# docker compose で全サービス（frontend / backend / postgres / tileserver）を起動する。
# TileServer GL は data/${OUTPUT_MBTILES} を読み込んで地図を配信する。

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
load_env
require_docker

output_path="${DATA_DIR}/${OUTPUT_MBTILES}"
if [ ! -f "${output_path}" ]; then
  die "MBTiles が見つかりません: ${output_path}
  先に以下を実行してください:
    ./scripts/download-map.sh
    ./scripts/generate-mbtiles.sh"
fi

cd "${REPO_ROOT}"
log "全サービスを起動します（TileServer GL: http://localhost:8081 ）..."
exec docker compose up "$@"
