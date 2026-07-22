import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * ヘッダー + メイン領域の基本レイアウト。
 * 画面構成: 上部ヘッダー、下部に地図が画面いっぱいに広がる。
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
