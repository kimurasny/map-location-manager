// ドメイン型は OpenAPI Generator の生成型を単一の情報源として再エクスポートする。
// これにより API 仕様と型が常に一致し、アプリ内での型の重複定義を防ぐ。
export type { Location, LocationRequest } from '@/api/generated';

/** 地図上の座標（緯度・経度）。地点登録フローで一時的に保持する。 */
export interface LatLng {
  lat: number;
  lng: number;
}
