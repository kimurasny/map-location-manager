#!/usr/bin/env bash
#
# 生成物（PBF・MBTiles・bbox・OpenMapTiles 作業ディレクトリ）を削除する。
# ソースコードや設定ファイルは削除しない。

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
load_env

log "以下を削除します:"
log "  - ${DATA_DIR}/*.osm.pbf, *.mbtiles, *.bbox"
log "  - ${OMT_DIR}（OpenMapTiles 作業ディレクトリ）"

if [ "${FORCE:-0}" != "1" ]; then
  read -r -p "削除してよろしいですか? [y/N] " ans
  case "${ans}" in
    [yY] | [yY][eE][sS]) ;;
    *) die "処理を中止しました。" ;;
  esac
fi

# OpenMapTiles 側で起動中のコンテナがあれば停止・削除する。
if [ -d "${OMT_DIR}/.git" ]; then
  ( cd "${OMT_DIR}" && make destroy-db >/dev/null 2>&1 ) || true
fi

rm -f "${DATA_DIR}"/*.osm.pbf "${DATA_DIR}"/*.osm.pbf.download \
      "${DATA_DIR}"/*.mbtiles "${DATA_DIR}"/*.bbox 2>/dev/null || true
rm -rf "${OMT_DIR}"

log "削除が完了しました。"
