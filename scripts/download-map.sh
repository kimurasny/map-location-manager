#!/usr/bin/env bash
#
# OpenStreetMap の PBF データを Geofabrik からダウンロードする。
#
# .env の PBF_URL からダウンロードし、data/${MAP_NAME}-latest.osm.pbf として保存する。
# 対象地域を変更する場合は .env の MAP_NAME / PBF_URL を書き換えるだけでよい。

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
load_env

mkdir -p "${DATA_DIR}"

log "対象地域       : ${MAP_NAME}"
log "ダウンロード元 : ${PBF_URL}"
log "保存先         : ${PBF_FILE}"

confirm_overwrite "${PBF_FILE}"

# 一時ファイルへダウンロードし、成功したら正式なファイル名へ移動する（中断時の破損を防ぐ）。
tmp_file="${PBF_FILE}.download"
trap 'rm -f "${tmp_file}"' EXIT

log "ダウンロードを開始します..."
if ! curl -fSL --retry 3 --retry-delay 5 -o "${tmp_file}" "${PBF_URL}"; then
  die "ダウンロードに失敗しました: ${PBF_URL}"
fi

# 妥当性チェック: ファイルが空でないこと。
[ -s "${tmp_file}" ] || die "ダウンロードしたファイルが空です: ${PBF_URL}"

mv "${tmp_file}" "${PBF_FILE}"
trap - EXIT

log "ダウンロードが完了しました: ${PBF_FILE} ($(du -h "${PBF_FILE}" | cut -f1))"
log "次は scripts/generate-mbtiles.sh を実行して MBTiles を生成してください。"
