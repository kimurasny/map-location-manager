/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API の基底 URL。未指定時は同一オリジンを利用する。 */
  readonly VITE_API_BASE_URL?: string;
  /** 地図タイルの URL テンプレート（TileServer GL）。 */
  readonly VITE_TILE_URL?: string;
  /** 地図初期中心の緯度。 */
  readonly VITE_MAP_CENTER_LAT?: string;
  /** 地図初期中心の経度。 */
  readonly VITE_MAP_CENTER_LNG?: string;
  /** 地図初期ズーム。 */
  readonly VITE_MAP_ZOOM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
