import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SidePanel } from '@/components/ui/SidePanel';
import { LocationDetail } from '@/features/location/LocationDetail';
import { LocationForm } from '@/features/location/LocationForm';
import { LocationMap } from '@/features/location/LocationMap';
import type { LocationFormValues } from '@/features/location/schema';
import {
  useCreateLocation,
  useDeleteLocation,
  useLocations,
  useUpdateLocation,
} from '@/hooks/useLocations';
import type { LatLng, Location } from '@/types/location';
import { resolveApiErrorMessage } from '@/utils/apiError';
import styles from './MapPage.module.css';

/**
 * パネルの表示状態を表す判別可能なユニオン。
 * これらは UI 状態のため useState で保持する（サーバーデータは React Query が管理）。
 */
type PanelState =
  | { mode: 'closed' }
  | { mode: 'create'; position: LatLng }
  | { mode: 'detail'; location: Location }
  | { mode: 'edit'; location: Location };

/**
 * アプリのメイン画面。地図・サイドパネル・確認ダイアログを統合し、
 * 地点の登録・閲覧・編集・削除フローを制御する。
 */
export function MapPage() {
  const { data: locations, isLoading, isError } = useLocations();
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();

  const [panel, setPanel] = useState<PanelState>({ mode: 'closed' });
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const closePanel = () => {
    setPanel({ mode: 'closed' });
    setSubmitError(undefined);
  };

  const handleMapClick = (position: LatLng) => {
    setSubmitError(undefined);
    setPanel({ mode: 'create', position });
  };

  const handleMarkerClick = (location: Location) => {
    setSubmitError(undefined);
    setPanel({ mode: 'detail', location });
  };

  const handleCreate = async (values: LocationFormValues) => {
    setSubmitError(undefined);
    try {
      await createMutation.mutateAsync({
        title: values.title,
        description: values.description ?? null,
        latitude: values.latitude,
        longitude: values.longitude,
      });
      closePanel();
    } catch (error) {
      setSubmitError(await resolveApiErrorMessage(error));
    }
  };

  const handleUpdate = async (id: string, values: LocationFormValues) => {
    setSubmitError(undefined);
    try {
      const updated = await updateMutation.mutateAsync({
        id,
        request: {
          title: values.title,
          description: values.description ?? null,
          latitude: values.latitude,
          longitude: values.longitude,
        },
      });
      setPanel({ mode: 'detail', location: updated });
    } catch (error) {
      setSubmitError(await resolveApiErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      closePanel();
    } catch (error) {
      setSubmitError(await resolveApiErrorMessage(error));
      setDeleteTarget(null);
    }
  };

  const draft = panel.mode === 'create' ? panel.position : null;

  return (
    <div className={styles.container}>
      <LocationMap
        locations={locations ?? []}
        draft={draft}
        onMapClick={handleMapClick}
        onMarkerClick={handleMarkerClick}
      />

      {isLoading && (
        <p className={styles.status} role="status">
          地点を読み込み中…
        </p>
      )}
      {isError && (
        <p className={`${styles.status} ${styles.statusError}`} role="alert">
          地点の読み込みに失敗しました
        </p>
      )}

      <SidePanel
        open={panel.mode === 'create'}
        title="地点を登録"
        onClose={closePanel}
      >
        {panel.mode === 'create' && (
          <LocationForm
            defaultValues={{
              title: '',
              description: '',
              latitude: panel.position.lat,
              longitude: panel.position.lng,
            }}
            submitting={createMutation.isPending}
            submitLabel="登録"
            submitError={submitError}
            onSubmit={handleCreate}
            onCancel={closePanel}
          />
        )}
      </SidePanel>

      <SidePanel
        open={panel.mode === 'detail'}
        title="地点の詳細"
        onClose={closePanel}
      >
        {panel.mode === 'detail' && (
          <LocationDetail
            location={panel.location}
            onEdit={() => setPanel({ mode: 'edit', location: panel.location })}
            onDelete={() => setDeleteTarget(panel.location)}
          />
        )}
      </SidePanel>

      <SidePanel
        open={panel.mode === 'edit'}
        title="地点を編集"
        onClose={closePanel}
      >
        {panel.mode === 'edit' && (
          <LocationForm
            defaultValues={{
              title: panel.location.title,
              description: panel.location.description ?? '',
              latitude: panel.location.latitude,
              longitude: panel.location.longitude,
            }}
            submitting={updateMutation.isPending}
            submitLabel="更新"
            submitError={submitError}
            onSubmit={(values) => handleUpdate(panel.location.id, values)}
            onCancel={() => setPanel({ mode: 'detail', location: panel.location })}
          />
        )}
      </SidePanel>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="地点の削除"
        message={
          deleteTarget
            ? `「${deleteTarget.title}」を削除します。この操作は取り消せません。`
            : ''
        }
        confirmLabel="削除する"
        busy={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
