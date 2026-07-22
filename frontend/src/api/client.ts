import { Configuration, LocationsApi } from './generated';

/**
 * OpenAPI Generator が生成したクライアントを一元的に構成するモジュール。
 *
 * 手書き fetch は禁止のため、API 呼び出しは必ずこのファイルが公開する
 * インスタンス経由で行う。基底 URL は環境変数 `VITE_API_BASE_URL` で上書きでき、
 * 未指定時は同一オリジン（Vite の proxy / Nginx リバースプロキシ）を利用する。
 */
const configuration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL ?? '',
});

/** 地点情報 API クライアント（シングルトン）。 */
export const locationsApi = new LocationsApi(configuration);
