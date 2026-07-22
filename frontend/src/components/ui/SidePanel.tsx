import type { ReactNode } from 'react';
import { Button } from './Button';
import styles from './SidePanel.module.css';

interface SidePanelProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * 画面右側に表示するサイドパネル。
 * マーカークリック時の詳細表示や、地点の登録・編集フォームを内包する。
 */
export function SidePanel({ open, title, onClose, children }: SidePanelProps) {
  if (!open) return null;

  return (
    <aside className={styles.panel} aria-label={title}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <Button
          variant="secondary"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="パネルを閉じる"
        >
          ×
        </Button>
      </div>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
