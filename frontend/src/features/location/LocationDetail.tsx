import { Button } from '@/components/ui/Button';
import type { Location } from '@/types/location';
import { formatCoordinate, formatDateTime } from '@/utils/format';
import styles from './LocationDetail.module.css';

interface LocationDetailProps {
  location: Location;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * 選択された地点の詳細表示。
 * タイトル・説明・緯度・経度と作成/更新日時を表示し、編集・削除操作を提供する。
 */
export function LocationDetail({ location, onEdit, onDelete }: LocationDetailProps) {
  return (
    <div className={styles.detail}>
      <dl className={styles.list}>
        <dt>タイトル</dt>
        <dd>{location.title}</dd>

        <dt>説明</dt>
        <dd>{location.description ? location.description : '（未入力）'}</dd>

        <dt>緯度</dt>
        <dd>{formatCoordinate(location.latitude)}</dd>

        <dt>経度</dt>
        <dd>{formatCoordinate(location.longitude)}</dd>

        <dt>作成日時</dt>
        <dd>{formatDateTime(location.createdAt)}</dd>

        <dt>更新日時</dt>
        <dd>{formatDateTime(location.updatedAt)}</dd>
      </dl>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onEdit}>
          編集
        </Button>
        <Button variant="danger" onClick={onDelete}>
          削除
        </Button>
      </div>
    </div>
  );
}
