"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from "../SentenceList.module.css"; // スタイル用のCSSモジュールを作成

export default function SentenceList() {
  const router = useRouter();
  const { testerNumber } = router.query;
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(true); // ローディング状態を管理

  useEffect(() => {
    if (!testerNumber) return;

    const fetchSentences = async () => {
      try {
        const episodesRef = collection(db, "4Wwords", testerNumber, "episodeC");
        const querySnapshot = await getDocs(episodesRef);

        const filteredSentences = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((data) => data.sentence)
          .map((data) => data.sentence);

        setSentences(filteredSentences);
      } catch (error) {
        console.error("Error fetching sentences: ", error);
      } finally {
        setLoading(false); // データ取得完了後にローディングを終了
      }
    };

    fetchSentences();
  }, [testerNumber]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>実験参加者番号：{testerNumber}</h1>
      {loading ? (
        <p className={styles.loading}>Loading...</p> // ローディング表示
      ) : (
        <ul className={styles.list}>
          {sentences.length > 0 ? (
            sentences.map((sentence, index) => (
              <li key={index} className={styles.sentenceItem}>
                {sentence}
              </li>
            ))
          ) : (
            <p className={styles.noSentences}>No sentences available for this tester.</p>
          )}
        </ul>
      )}
    </div>
  );
}
