"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";
import { useEpisode } from "../../contexts/EpisodeContext";

export default function InputTesterNumber() {
  const router = useRouter();
  const [testerNumber, setTesterNumber] = useState(""); // 被験者番号を保存する状態を追加
  const { episodeType, setEpisodeType } = useEpisode();

  const onSubmit = (e) => {
    e.preventDefault();
    const testerNumber = e.target[0].value;
    if (testerNumber) {
      router.push(`/sentence/${testerNumber}`);
    }
  };

  const handleInputChange = (e) => {
    setTesterNumber(e.target.value); // 入力された値を更新
  };

  // エピソードIDの選択変更処理
  const handleEpisodeChange = (e) => {
    setEpisodeType(e.target.value);
  };

  return (
    <main className={styles.main}>
      <h2 className={styles.title}>実験参加者番号を入力してください</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="tester-number">実験参加者番号</label>
        <input
          id="tester-number"
          type="number"
          value={testerNumber}
          onChange={handleInputChange}
          required
        />

        <div className="input-group">
          <label htmlFor="episode-switcher" className={styles.episodeSwitcher}>
            エピソードを選択
          </label>
          <select
            id="episode-switcher"
            value={episodeType}
            onChange={handleEpisodeChange}
          >
            <option value="episodeA">Episode A</option>
            <option value="episodeB">Episode B</option>
            <option value="episodeC">Episode C</option>
          </select>
        </div>

        <button type="submit">OK</button>
      </form>
    </main>
  );
}