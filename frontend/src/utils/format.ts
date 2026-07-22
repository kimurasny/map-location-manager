/** 緯度・経度を小数第6位までの文字列に整形する。 */
export function formatCoordinate(value: number): string {
  return value.toFixed(6);
}

/** ISO 日時（Date）を日本語ロケールの表示用文字列に整形する。 */
export function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}
