import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import styles from './Field.module.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** ラベル文言。 */
  label: string;
  /** 必須項目かどうか。 */
  required?: boolean;
  /** エラーメッセージ（存在時のみ表示）。 */
  error?: string;
}

/**
 * DADS 準拠の複数行テキスト入力フィールド。
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, required, error, id, ...rest }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const errorId = `${fieldId}-error`;

    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={fieldId}>
          {label}
          {required && (
            <span className={styles.requiredBadge} aria-hidden="true">
              必須
            </span>
          )}
        </label>
        <textarea
          id={fieldId}
          ref={ref}
          className={styles.control}
          rows={4}
          aria-required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
