"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from "../../../styles/SentenceList.module.css";
import { PullToRefreshView } from "../../../hooks/PullToRefreshView";

export default function SentenceList() {
  const router = useRouter();
  const { testerNumber } = router.query;
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSentences = async () => {
    if (!testerNumber) return;
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentences();
  }, [testerNumber]);

  const getRandomSentences = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const randomSentences = getRandomSentences(sentences, 6);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchSentences();
  };

  return (
    <div className={styles.container}>
      <PullToRefreshView onRefresh={handleRefresh}>
        {/* <h1 className={styles.header}>実験参加者番号：{testerNumber}</h1> */}
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <ul className={styles.list}>
            {randomSentences.length > 0 ? (
              randomSentences.map((sentence, index) => (
                <li key={index} className={styles.sentenceItem}>
                  {sentence}
                </li>
              ))
            ) : (
              <p className={styles.noSentences}>
                No sentences available for this tester.
              </p>
            )}
          </ul>
        )}
      </PullToRefreshView>
    </div>
  );
}
