#!/usr/bin/env bash
#
# 各スクリプトが共通で利用するヘルパー。
# .env の読み込み、ログ出力、前提条件チェックをまとめる。

set -euo pipefail

# リポジトリのルート（このファイルの1つ上の階層）
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 生成物の出力先
DATA_DIR="${REPO_ROOT}/data"

# OpenMapTiles の作業ディレクトリ（git 管理外）
OMT_DIR="${REPO_ROOT}/.openmaptiles"

log()  { printf '\033[1;34m[INFO]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[WARN]\033[0m %s\n' "$*" >&2; }
err()  { printf '\033[1;31m[ERROR]\033[0m %s\n' "$*" >&2; }

# 異常終了用。メッセージを出して終了コード1で抜ける。
die() { err "$*"; exit 1; }

# .env を読み込み、必須変数が設定されているか確認する。
load_env() {
  local env_file="${REPO_ROOT}/.env"
  [ -f "${env_file}" ] || die ".env が見つかりません: ${env_file}"
  # shellcheck disable=SC1090
  set -a; source "${env_file}"; set +a

  : "${MAP_NAME:?.env に MAP_NAME が設定されていません}"
  : "${PBF_URL:?.env に PBF_URL が設定されていません}"
  : "${OUTPUT_MBTILES:?.env に OUTPUT_MBTILES が設定されていません}"

  # ダウンロードした PBF の保存先ファイル名
  PBF_FILE="${DATA_DIR}/${MAP_NAME}-latest.osm.pbf"
}

# Docker が利用可能か（デーモンが起動しているか）を確認する。
require_docker() {
  command -v docker >/dev/null 2>&1 || die "docker コマンドが見つかりません。Docker をインストールしてください。"
  docker info >/dev/null 2>&1 || die "Docker デーモンに接続できません。Docker を起動してください。"
}

# 既存ファイルがある場合に上書き確認する。CI 等では FORCE=1 で確認を省略できる。
confirm_overwrite() {
  local target="$1"
  [ -e "${target}" ] || return 0
  if [ "${FORCE:-0}" = "1" ]; then
    warn "既存ファイルを上書きします: ${target}"
    return 0
  fi
  read -r -p "既存ファイルがあります (${target})。上書きしますか? [y/N] " ans
  case "${ans}" in
    [yY] | [yY][eE][sS]) return 0 ;;
    *) die "処理を中止しました。" ;;
  esac
}
