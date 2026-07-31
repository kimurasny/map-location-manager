import type { StyleSpecification, ExpressionSpecification } from 'maplibre-gl';

/**
 * TileServer GL が配信する OpenMapTiles(v3 スキーマ) のベクタタイルから
 * 「高速道路 / IC・JCT・SA・PA / 道路番号 / 鉄道路線 / 市区町村名 / 河川名 /
 * 公園名 / 地名ラベル」を描画するための地図スタイルを生成する。
 *
 * TileServer GL 同梱の basic-preview（ラスタ）はこれらのラベルをほとんど
 * 描画しないため、必要なレイヤのみを自前で定義している。
 */

/** ベクタタイルのソース ID（各レイヤから参照する）。 */
const SOURCE_ID = 'omt';

/** 日本語名を優先し、無ければ既定の name を表示する式。 */
const LABEL_TEXT: ExpressionSpecification = [
  'coalesce',
  ['get', 'name:ja'],
  ['get', 'name'],
];

/** ラベル用フォント（CJK はブラウザのローカルフォントで描画する）。 */
const FONT = ['Noto Sans Regular'];

/** 白フチ付きラベルの共通ペイント設定。 */
const LABEL_PAINT = {
  'text-color': '#333333',
  'text-halo-color': '#ffffff',
  'text-halo-width': 1.4,
};

/** 色の定義（淡色ベースに道路と鉄道を強調する配色）。 */
const COLOR = {
  background: '#f7f5f2',
  water: '#a9d3ef',
  wood: '#d6e6cd',
  park: '#dff0d8',
  building: '#e4e0da',
  boundary: '#b09fc0',
  motorway: '#f2a25c',
  trunk: '#f6c88a',
  primary: '#fbe8a6',
  road: '#ffffff',
  roadOutline: '#d9d4cc',
  rail: '#8d8d94',
} as const;

/**
 * 地図スタイルを生成する。
 *
 * @param tileJsonUrl TileServer GL の TileJSON URL（例: http://localhost:8081/data/kanto.json）
 * @param glyphsUrl   フォント(glyphs)の URL テンプレート
 */
export function buildMapStyle(
  tileJsonUrl: string,
  glyphsUrl: string,
): StyleSpecification {
  return {
    version: 8,
    name: 'map-location-manager 日本語ラベル',
    glyphs: glyphsUrl,
    sources: {
      [SOURCE_ID]: { type: 'vector', url: tileJsonUrl },
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': COLOR.background },
      },
      {
        id: 'landcover-wood',
        type: 'fill',
        source: SOURCE_ID,
        'source-layer': 'landcover',
        filter: ['in', ['get', 'class'], ['literal', ['wood', 'grass']]],
        paint: { 'fill-color': COLOR.wood, 'fill-opacity': 0.6 },
      },
      {
        id: 'park',
        type: 'fill',
        source: SOURCE_ID,
        'source-layer': 'park',
        paint: { 'fill-color': COLOR.park, 'fill-opacity': 0.7 },
      },
      {
        id: 'water',
        type: 'fill',
        source: SOURCE_ID,
        'source-layer': 'water',
        paint: { 'fill-color': COLOR.water },
      },
      {
        id: 'waterway',
        type: 'line',
        source: SOURCE_ID,
        'source-layer': 'waterway',
        paint: {
          'line-color': COLOR.water,
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 16, 4],
        },
      },
      {
        id: 'building',
        type: 'fill',
        source: SOURCE_ID,
        'source-layer': 'building',
        minzoom: 14,
        paint: { 'fill-color': COLOR.building, 'fill-opacity': 0.7 },
      },
      // 行政界（都道府県 = admin_level 4 まで、市区町村 = 6 以上は破線）
      {
        id: 'boundary-prefecture',
        type: 'line',
        source: SOURCE_ID,
        'source-layer': 'boundary',
        filter: ['<=', ['get', 'admin_level'], 4],
        paint: { 'line-color': COLOR.boundary, 'line-width': 1.2 },
      },
      {
        id: 'boundary-municipality',
        type: 'line',
        source: SOURCE_ID,
        'source-layer': 'boundary',
        minzoom: 9,
        filter: ['>=', ['get', 'admin_level'], 6],
        paint: {
          'line-color': COLOR.boundary,
          'line-width': 0.8,
          'line-dasharray': [3, 2],
          'line-opacity': 0.7,
        },
      },
      // 道路（重要度の低い順に重ねる）
      {
        id: 'road-minor',
        type: 'line',
        source: SOURCE_ID,
        'source-layer': 'transportation',
        minzoom: 12,
        filter: [
          'in',
          ['get', 'class'],
          ['literal', ['minor', 'service', 'track']],
        ],
        paint: {
          'line-color': COLOR.road,
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.6, 18, 6],
        },
      },
      {
        id: 'road-secondary',
        type: 'line',
        source: SOURCE_ID,
        'source-layer': 'transportation',
        filter: [
          'in',
          ['get', 'class'],
          ['literal', ['secondary', 'tertiary']],
        ],
        paint: {
          'line-color': COLOR.road,
          'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.8, 18, 8],
        },
      },
      {
        id: 'road-primary',
        type: 'line',
        source: SOURCE_ID,
        'source-layer': 'transportation',
        filter: ['==', ['get', 'class'], 'primary'],
        paint: {
          'line-color': COLOR.primary,
          'line-width': ['interpolate', ['linear'], ['zoom'], 7, 0.8, 18, 10],
        },
      },
      {
        id: 'road-trunk',
        type: 'line',
        source: SOURCE_ID,
        'source-layer': 'transportation',
        filter: ['==', ['get', 'class'], 'trunk'],
        paint: {
          'line-color': COLOR.trunk,
          'line-width': ['interpolate', ['linear'], ['zoom'], 6, 0.8, 18, 11],
        },
      },
      // 高速道路
      {
        id: 'road-motorway',
        type: 'line',
        source: SOURCE_ID,
        'source-layer': 'transportation',
        filter: ['==', ['get', 'class'], 'motorway'],
        paint: {
          'line-color': COLOR.motorway,
          'line-width': ['interpolate', ['linear'], ['zoom'], 5, 1, 18, 12],
        },
      },
      // 鉄道路線
      {
        id: 'railway',
        type: 'line',
        source: SOURCE_ID,
        'source-layer': 'transportation',
        minzoom: 8,
        filter: ['in', ['get', 'class'], ['literal', ['rail', 'transit']]],
        paint: {
          'line-color': COLOR.rail,
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.6, 18, 3],
          'line-dasharray': [4, 2],
        },
      },
      // ---- ここからラベル ----
      {
        id: 'label-waterway',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'waterway',
        minzoom: 11,
        filter: ['in', ['get', 'class'], ['literal', ['river', 'canal']]],
        layout: {
          'symbol-placement': 'line',
          'text-field': LABEL_TEXT,
          'text-font': FONT,
          'text-size': 11,
        },
        paint: { ...LABEL_PAINT, 'text-color': '#3d78a0' },
      },
      {
        id: 'label-water-name',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'water_name',
        layout: {
          'text-field': LABEL_TEXT,
          'text-font': FONT,
          'text-size': 12,
        },
        paint: { ...LABEL_PAINT, 'text-color': '#3d78a0' },
      },
      {
        id: 'label-park',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'park',
        minzoom: 11,
        filter: ['has', 'name'],
        layout: {
          'text-field': LABEL_TEXT,
          'text-font': FONT,
          'text-size': 11,
        },
        paint: { ...LABEL_PAINT, 'text-color': '#3f7a3f' },
      },
      // 道路名（一般道）
      {
        id: 'label-road-name',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'transportation_name',
        minzoom: 13,
        filter: [
          'all',
          ['has', 'name'],
          [
            'in',
            ['get', 'class'],
            ['literal', ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor']],
          ],
        ],
        layout: {
          'symbol-placement': 'line',
          'text-field': LABEL_TEXT,
          'text-font': FONT,
          'text-size': 11,
        },
        paint: LABEL_PAINT,
      },
      // 鉄道路線名
      {
        id: 'label-railway-name',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'transportation_name',
        minzoom: 11,
        filter: ['in', ['get', 'class'], ['literal', ['rail', 'transit']]],
        layout: {
          'symbol-placement': 'line',
          'text-field': LABEL_TEXT,
          'text-font': FONT,
          'text-size': 11,
        },
        paint: { ...LABEL_PAINT, 'text-color': '#5a5a66' },
      },
      // 道路番号（ref）。高速道路・国道などの番号を強調表示する。
      {
        id: 'label-road-ref',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'transportation_name',
        minzoom: 10,
        filter: [
          'all',
          ['has', 'ref'],
          [
            'in',
            ['get', 'class'],
            ['literal', ['motorway', 'trunk', 'primary', 'secondary']],
          ],
        ],
        layout: {
          'symbol-placement': 'line',
          'symbol-spacing': 220,
          'text-field': ['get', 'ref'],
          'text-font': FONT,
          'text-size': 11,
          'text-padding': 2,
        },
        paint: {
          'text-color': '#8a4b12',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
        },
      },
      // IC・JCT（highway=motorway_junction）。番号があれば「番号 名称」で表示。
      {
        id: 'label-junction',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'transportation_name',
        minzoom: 12,
        filter: ['==', ['get', 'class'], 'motorway_junction'],
        layout: {
          'text-field': [
            'case',
            ['has', 'ref'],
            ['concat', ['get', 'ref'], ' ', LABEL_TEXT],
            LABEL_TEXT,
          ],
          'text-font': FONT,
          'text-size': 11,
          'text-anchor': 'left',
          'text-offset': [0.6, 0],
        },
        paint: { ...LABEL_PAINT, 'text-color': '#a0521a' },
      },
      // SA・PA（highway=services / rest_area）。POI レイヤ拡張により出力される。
      {
        id: 'label-rest-area',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'poi',
        minzoom: 12,
        filter: [
          'in',
          ['get', 'subclass'],
          ['literal', ['rest_area', 'services']],
        ],
        layout: {
          'text-field': LABEL_TEXT,
          'text-font': FONT,
          'text-size': 11,
        },
        paint: { ...LABEL_PAINT, 'text-color': '#a0521a' },
      },
      // 駅名
      {
        id: 'label-station',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'poi',
        minzoom: 13,
        filter: ['==', ['get', 'subclass'], 'station'],
        layout: {
          'text-field': LABEL_TEXT,
          'text-font': FONT,
          'text-size': 11,
        },
        paint: { ...LABEL_PAINT, 'text-color': '#5a5a66' },
      },
      // 地名ラベル（小さい地名から順に重ね、都市名を最前面にする）
      {
        id: 'label-place-small',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'place',
        minzoom: 12,
        filter: [
          'in',
          ['get', 'class'],
          ['literal', ['suburb', 'quarter', 'neighbourhood', 'hamlet', 'isolated_dwelling']],
        ],
        layout: {
          'text-field': LABEL_TEXT,
          'text-font': FONT,
          'text-size': 11,
        },
        paint: LABEL_PAINT,
      },
      // 市区町村名（city / town / village）
      {
        id: 'label-place-municipality',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'place',
        filter: [
          'in',
          ['get', 'class'],
          ['literal', ['city', 'town', 'village']],
        ],
        layout: {
          'text-field': LABEL_TEXT,
          'text-font': FONT,
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            6,
            ['case', ['==', ['get', 'class'], 'city'], 13, 10],
            14,
            ['case', ['==', ['get', 'class'], 'city'], 18, 13],
          ],
        },
        paint: { ...LABEL_PAINT, 'text-color': '#1f1f1f' },
      },
      // 都道府県名
      {
        id: 'label-place-state',
        type: 'symbol',
        source: SOURCE_ID,
        'source-layer': 'place',
        maxzoom: 10,
        filter: ['in', ['get', 'class'], ['literal', ['state', 'province']]],
        layout: {
          'text-field': LABEL_TEXT,
          'text-font': FONT,
          'text-size': 13,
        },
        paint: { ...LABEL_PAINT, 'text-color': '#6b6b7b' },
      },
    ],
  };
}
