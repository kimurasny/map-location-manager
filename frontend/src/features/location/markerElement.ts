/**
 * MapLibre GL のマーカーに渡す DOM 要素を生成する。
 * 将来アイコン種類（カテゴリ別アイコン等）を追加する場合の拡張ポイント。
 */
export function createMarkerElement(variant: 'saved' | 'draft'): HTMLElement {
  const element = document.createElement('div');
  element.className = variant === 'draft' ? 'mlm-marker mlm-marker--draft' : 'mlm-marker';
  element.setAttribute('role', 'img');
  element.setAttribute(
    'aria-label',
    variant === 'draft' ? '未登録の地点' : '登録済みの地点',
  );
  return element;
}
