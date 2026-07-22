import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { MapPage } from '@/pages/MapPage';

/**
 * ルーティング定義。
 * 現状は地図画面のみだが、将来のカテゴリ管理・検索などの画面追加を見据えて
 * React Router を導入している。
 */
export function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
