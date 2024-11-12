"use client";
import styles from "../styles/word.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEpisode } from "../contexts/EpisodeContext";

export default function Home() {
  const router = useRouter();
  const [testerNumber, setTesterNumber] = useState(""); // 被験者番号の状態
  const { episodeType, setEpisodeType } = useEpisode();
  console.log("episodeType:", episodeType);
  // フォームの送信処理
  const onSubmit = (e) => {
    e.preventDefault();
    if (testerNumber) {
      router.push(`/research/${testerNumber}`); // 被験者番号とエピソードIDを使って遷移
    } else {
      console.error("Tester Number is not provided.");
    }
  };

  // 被験者番号の入力変更処理
  const handleInputChange = (e) => {
    setTesterNumber(e.target.value);
  };

  // エピソードIDの選択変更処理
  const handleEpisodeChange = (e) => {
    setEpisodeType(e.target.value);
  };

  return (
    <main>
    <h2>被験者番号を入力してください</h2>
  
    <form onSubmit={onSubmit}>
      <div className="input-group">
        <label htmlFor="tester-number">被験者番号</label>
        <input
          id="tester-number"
          type="number"
          value={testerNumber}
          onChange={handleInputChange}
        />
      </div>
  
      <div className="input-group">
        <label htmlFor="episode-switcher" className={styles.episodeSwitcher}>エピソードを選択</label>
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
