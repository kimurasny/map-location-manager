import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import styles from './Field.module.css';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** ラベル文言。 */
  label: string;
  /** 必須項目かどうか。 */
  required?: boolean;
  /** エラーメッセージ（存在時のみ表示）。 */
  error?: string;
}

/**
 * DADS 準拠のテキスト入力フィールド。
 * ラベルと入力を関連付け、エラー時は aria-invalid / aria-describedby を付与する。
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
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
        <input
          id={fieldId}
          ref={ref}
          className={styles.control}
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

TextField.displayName = 'TextField';
