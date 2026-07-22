#!/usr/bin/env bash
#
# TileServer GL 用のアセット（スタイル・フォント・地図データ mbtiles）を取得する。
#
# 地図タイルは外部サービスに依存せず自前ホストする方針のため、初回のみ本スクリプトで
# 必要なアセットをダウンロードする。既定では OpenMapTiles 形式の動作確認用サンプル
# （チューリッヒ周辺）を取得する。別地域を表示したい場合は、対象地域の OpenMapTiles
# 形式 .mbtiles を tiles.mbtiles として配置し直すこと（README 参照）。
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

SAMPLE_URL="https://github.com/maptiler/tileserver-gl/releases/download/v1.3.0/test_data.zip"
TMP_ZIP="$(mktemp)"
TMP_DIR="$(mktemp -d)"

echo "サンプルデータをダウンロードします: ${SAMPLE_URL}"
curl -fSL "${SAMPLE_URL}" -o "${TMP_ZIP}"

echo "展開中..."
unzip -q -o "${TMP_ZIP}" -d "${TMP_DIR}"

echo "アセットを配置中..."
# スタイル（maptiler-basic）とフォントを配置する。
rm -rf styles fonts
cp -r "${TMP_DIR}/styles" styles
cp -r "${TMP_DIR}/fonts" fonts

# 地図データ（サンプル）を tiles.mbtiles として配置する。
cp "${TMP_DIR}/zurich_switzerland.mbtiles" tiles.mbtiles

rm -rf "${TMP_ZIP}" "${TMP_DIR}"

echo "完了しました。"
echo " - styles/maptiler-basic : 地図スタイル"
echo " - fonts                 : グリフフォント"
echo " - tiles.mbtiles         : 地図データ（サンプル: チューリッヒ周辺）"
echo ""
echo "別地域を表示する場合は、対象地域の OpenMapTiles 形式 .mbtiles を"
echo "tiles.mbtiles として置き換えてください。"
