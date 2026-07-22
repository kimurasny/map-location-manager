import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { TextField } from '@/components/ui/TextField';
import { formatCoordinate } from '@/utils/format';
import { locationFormSchema, type LocationFormValues } from './schema';
import styles from './LocationForm.module.css';

interface LocationFormProps {
  /** フォームの初期値。 */
  defaultValues: LocationFormValues;
  /** 送信中フラグ。 */
  submitting: boolean;
  /** 送信ボタンの文言。 */
  submitLabel: string;
  /** 送信エラー（存在時に表示）。 */
  submitError?: string;
  onSubmit: (values: LocationFormValues) => void;
  onCancel: () => void;
}

/**
 * 地点の登録・編集フォーム。
 * React Hook Form + Zod でバリデーションを行う。
 * 緯度・経度は地図クリックで確定するため読み取り専用で表示する。
 */
export function LocationForm({
  defaultValues,
  submitting,
  submitLabel,
  submitError,
  onSubmit,
  onCancel,
}: LocationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues,
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="タイトル"
        required
        maxLength={100}
        error={errors.title?.message}
        {...register('title')}
      />

      <TextArea
        label="説明"
        error={errors.description?.message}
        {...register('description')}
      />

      {/* 緯度・経度は地図クリックで確定した値を送信するため hidden で保持する。 */}
      <input type="hidden" {...register('latitude', { valueAsNumber: true })} />
      <input type="hidden" {...register('longitude', { valueAsNumber: true })} />

      <dl className={styles.coords}>
        <div>
          <dt>緯度</dt>
          <dd>{formatCoordinate(defaultValues.latitude)}</dd>
        </div>
        <div>
          <dt>経度</dt>
          <dd>{formatCoordinate(defaultValues.longitude)}</dd>
        </div>
      </dl>

      {submitError && (
        <p className={styles.submitError} role="alert">
          {submitError}
        </p>
      )}

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          キャンセル
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? '保存中…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
