import { forwardRef, type ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 見た目のバリエーション。 */
  variant?: Variant;
}

/**
 * DADS 準拠の基本ボタン。
 * 十分なタップ領域（高さ44px以上）とフォーカスリングを確保する。
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, type = 'button', ...rest }, ref) => {
    const classNames = [styles.button, styles[variant], className]
      .filter(Boolean)
      .join(' ');
    return <button ref={ref} type={type} className={classNames} {...rest} />;
  },
);

Button.displayName = 'Button';
