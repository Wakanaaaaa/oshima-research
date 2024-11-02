"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function InputTesterNumber() {
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    const testerNumber = e.target[0].value;
    if (testerNumber) {
      router.push(`/sentence/${testerNumber}`);
    }
  };

  return (
    <main className={styles.main}>
      <h2 className={styles.title}>実験参加者番号を入力してください</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="tester-number">実験参加者番号</label>
        <input id="tester-number" type="number" required />
        <button type="submit">OK</button>
      </form>
    </main>
  );
}

