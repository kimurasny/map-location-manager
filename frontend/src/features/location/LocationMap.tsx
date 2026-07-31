import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { LatLng, Location } from '@/types/location';
import { buildMapStyle } from './mapStyle';
import { createMarkerElement } from './markerElement';
import 'maplibre-gl/dist/maplibre-gl.css';
import './locationMap.css';

/**
 * TileServer GL の TileJSON URL（ベクタタイル）。環境変数で上書き可能。
 * OpenMapTiles の MBTiles はファイル名に関係なく `/data/v3.json` で配信される。
 */
const TILE_JSON_URL =
  import.meta.env.VITE_TILE_JSON_URL ?? 'http://localhost:8081/data/v3.json';

/** ラベル描画に使うフォント(glyphs)の URL テンプレート。 */
const GLYPHS_URL =
  import.meta.env.VITE_GLYPHS_URL ??
  'http://localhost:8081/fonts/{fontstack}/{range}.pbf';

/**
 * 地図の初期表示中心とズーム。環境変数で上書き可能。
 * 既定は東京駅付近（初期データの座標に合わせる）。
 */
const DEFAULT_CENTER: [number, number] = [
  Number(import.meta.env.VITE_MAP_CENTER_LNG ?? 139.767125),
  Number(import.meta.env.VITE_MAP_CENTER_LAT ?? 35.681236),
];
const DEFAULT_ZOOM = Number(import.meta.env.VITE_MAP_ZOOM ?? 12);

interface LocationMapProps {
  locations: Location[];
  /** 新規登録のためにクリックされた一時位置（未確定）。 */
  draft: LatLng | null;
  /** 地図クリック時（新規地点の位置指定）。 */
  onMapClick: (latlng: LatLng) => void;
  /** マーカークリック時（詳細表示）。 */
  onMarkerClick: (location: Location) => void;
}

/**
 * 地図表示と地点マーカーの描画を担うプレゼンテーション層。
 * ベクタタイルを MapLibre GL で描画し、道路・鉄道・地名などのラベルを表示する。
 * サーバー状態や UI 状態は保持せず、props と地図イベントのみを扱う。
 */
export function LocationMap({
  locations,
  draft,
  onMapClick,
  onMarkerClick,
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  /** 登録済み地点のマーカー（地点 ID をキーに保持し差分更新する）。 */
  const markersRef = useRef(new Map<string, maplibregl.Marker>());
  const draftMarkerRef = useRef<maplibregl.Marker | null>(null);
  /** 最新のコールバックを参照するための保持領域（地図の再生成を避ける）。 */
  const handlersRef = useRef({ onMapClick, onMarkerClick });
  handlersRef.current = { onMapClick, onMarkerClick };

  // 地図インスタンスの生成（マウント時のみ）。
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildMapStyle(TILE_JSON_URL, GLYPHS_URL),
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      // 日本語（CJK）はブラウザのローカルフォントで描画する。
      localIdeographFontFamily: "'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif",
      attributionControl: {
        customAttribution:
          '<a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap contributors</a>',
      },
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }));
    map.on('click', (event) => {
      handlersRef.current.onMapClick({
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
      });
    });

    mapRef.current = map;
    const markers = markersRef.current;
    return () => {
      markers.clear();
      draftMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 登録済み地点のマーカーを差分更新する。
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = markersRef.current;

    const nextIds = new Set(locations.map((location) => location.id));
    for (const [id, marker] of markers) {
      if (!nextIds.has(id)) {
        marker.remove();
        markers.delete(id);
      }
    }

    for (const location of locations) {
      const position: [number, number] = [location.longitude, location.latitude];
      const existing = markers.get(location.id);
      if (existing) {
        existing.setLngLat(position);
        continue;
      }
      const element = createMarkerElement('saved');
      element.addEventListener('click', (event) => {
        // 地図側のクリック（新規登録）と重複させない。
        event.stopPropagation();
        handlersRef.current.onMarkerClick(location);
      });
      markers.set(
        location.id,
        new maplibregl.Marker({ element, anchor: 'bottom' })
          .setLngLat(position)
          .addTo(map),
      );
    }
  }, [locations]);

  // 未確定（新規登録用）のマーカーを反映する。
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!draft) {
      draftMarkerRef.current?.remove();
      draftMarkerRef.current = null;
      return;
    }
    if (draftMarkerRef.current) {
      draftMarkerRef.current.setLngLat([draft.lng, draft.lat]);
      return;
    }
    draftMarkerRef.current = new maplibregl.Marker({
      element: createMarkerElement('draft'),
      anchor: 'bottom',
    })
      .setLngLat([draft.lng, draft.lat])
      .addTo(map);
  }, [draft]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
}
