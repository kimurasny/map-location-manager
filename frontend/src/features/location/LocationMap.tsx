import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import type { LatLng, Location } from '@/types/location';
import { defaultMarkerIcon, draftMarkerIcon } from './leafletIcon';
import 'leaflet/dist/leaflet.css';

/** 地図タイルの URL。TileServer GL を利用し、環境変数で上書き可能。 */
const TILE_URL =
  import.meta.env.VITE_TILE_URL ??
  'http://localhost:8081/styles/basic/{z}/{x}/{y}.png';

/**
 * 地図の初期表示中心とズーム。環境変数で上書き可能。
 * 既定は東京駅付近（初期データの座標に合わせる）。
 */
const DEFAULT_CENTER: [number, number] = [
  Number(import.meta.env.VITE_MAP_CENTER_LAT ?? 35.681236),
  Number(import.meta.env.VITE_MAP_CENTER_LNG ?? 139.767125),
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

/** 地図上のクリックイベントを購読する内部コンポーネント。 */
function MapClickHandler({ onMapClick }: { onMapClick: (latlng: LatLng) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

/**
 * 地図表示と地点マーカーの描画を担うプレゼンテーション層。
 * サーバー状態や UI 状態は保持せず、props と Leaflet のイベントのみを扱う。
 */
export function LocationMap({
  locations,
  draft,
  onMapClick,
  onMarkerClick,
}: LocationMapProps) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url={TILE_URL}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler onMapClick={onMapClick} />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={defaultMarkerIcon}
          eventHandlers={{ click: () => onMarkerClick(location) }}
        />
      ))}

      {draft && (
        <Marker position={[draft.lat, draft.lng]} icon={draftMarkerIcon} />
      )}
    </MapContainer>
  );
}
