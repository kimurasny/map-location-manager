import styles from './Header.module.css';

/** アプリ共通のヘッダー。 */
export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>地点情報マネージャー</h1>
      <p className={styles.subtitle}>地図をクリックして地点を登録・管理できます</p>
    </header>
  );
}
