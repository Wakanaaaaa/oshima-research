"use client";
import styles from "../styles/word.module.css";
import { useState } from "react"; // useStateを追加
import { useRouter } from "next/navigation";
import { useEpisode } from "../contexts/EpisodeContext";

export default function Home() {
  const router = useRouter();
  const [testerNumber, setTesterNumber] = useState(""); // 被験者番号を保存する状態を追加
  const { episodeType, setEpisodeType } = useEpisode();

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
    if (testerNumber) {
      router.push(`/research/${testerNumber}`); // 被験者番号を使って遷移
    } else {
      console.error("Tester Number is not provided.");
    }
  };

  // 被験者番号の入力変更処理
  const handleInputChange = (e) => {
    setTesterNumber(e.target.value); // 入力された値を更新
  };

  // エピソードIDの選択変更処理
  const handleEpisodeChange = (e) => {
    setEpisodeType(e.target.value);
  };

  return (
    <main className={styles.main}>
      <h2 className={styles.title}>--被験者番号を入力してください--</h2>

      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label htmlFor="tester-number">被験者番号</label>
          <input
            id="tester-number"
            type="number"
            value={testerNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <select
            id="episode-switcher"
            value={episodeType || ""} // 初期値は空に設定
            onChange={handleEpisodeChange}
          >
            <option value="" disabled>
              エピソードを選択
            </option>
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
