"use client";

import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>-話題選択支援研究-</h1>
      <div>
        <Link href="/input-tester-number" passHref>
          <button className={styles.button}>エピソードを表示する</button>
        </Link>
      </div>
    </main>
  );
}
