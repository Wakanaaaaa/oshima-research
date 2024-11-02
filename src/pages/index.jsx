"use client";

import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>話題選択支援研究</h1>
      <h2 className={styles.title}>エピソードを表示する</h2>
      <div>
        <Link href="/input-tester-number" passHref>
          <button className={styles.button}>入力を開始する</button>
        </Link>
      </div>
    </main>
  );
}
