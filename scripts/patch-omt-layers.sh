#!/usr/bin/env bash
#
# OpenMapTiles の標準スキーマ(v3)に不足しているデータを補うため、
# 取得した OpenMapTiles 作業ディレクトリのレイヤ定義へ最小限の追記を行う。
#
# 追加内容:
#   - poi レイヤに highway=rest_area / highway=services を追加
#     （高速道路の SA・PA。標準スキーマでは対象外のため名前が出力されない）
#
# 追加された地物は poi レイヤに subclass='rest_area' / 'services' として出力される。
# IC・JCT（highway=motorway_junction）は標準スキーマの transportation_name レイヤに
# class='motorway_junction' で含まれるため、ここでの拡張は不要。
#
# generate-mbtiles.sh から呼び出される（何度実行しても結果が変わらない）。

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

mapping_file="${OMT_DIR}/layers/poi/mapping.yaml"
[ -f "${mapping_file}" ] || die "レイヤ定義が見つかりません: ${mapping_file}"

# 追加する OSM の highway タグ値
readonly REST_AREA_VALUES=("rest_area" "services")

anchor='def_poi_mapping_highway: &poi_mapping_highway'
grep -q "${anchor}" "${mapping_file}" \
  || die "poi レイヤの定義形式が想定と異なります: ${mapping_file}"

for value in "${REST_AREA_VALUES[@]}"; do
  if grep -q "^  - ${value}$" "${mapping_file}"; then
    log "poi レイヤに ${value} は追加済みです（スキップ）"
    continue
  fi
  # アンカー行の直後へ値を挿入する。
  sed -i "/^${anchor}$/a\\  - ${value}" "${mapping_file}"
  log "poi レイヤへ highway=${value} を追加しました"
done
