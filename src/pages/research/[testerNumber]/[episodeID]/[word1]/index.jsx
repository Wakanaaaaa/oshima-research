"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";
import Link from "next/link";
import styles from "@/styles/word.module.css";
import { useEpisode } from "@/contexts/EpisodeContext";
import { PullToRefreshView } from "@/PullToRefreshView";

export default function Word1() {
  const router = useRouter();
  const { episodeID, word1 } = router.query;
  const [keywords, setKeywords] = useState([]);
  const [colors, setColors] = useState([]);
  const { testerNumber } = router.query;
  const { addToRefs } = usePinchZoom(testerNumber);
  const { episodeType } = useEpisode();

  // Firestore からデータを取得する関数
  const fetchDocumentsForWord1 = useCallback(async () => {
    try {
      const subcollectionRef = collection(
        db,
        "4Wwords",
        testerNumber,
        episodeType
      );

      const subcollectionSnapshot = await getDocs(subcollectionRef);

      const allFieldsArray = [];
      const seenValues = new Set();

      subcollectionSnapshot.forEach((doc) => {
        const data = doc.data();
        const docID = doc.id;

        let hasWord1 = false;
        for (const [key, value] of Object.entries(data)) {
          if (value === word1) {
            hasWord1 = true;
            break;
          }
        }

        if (hasWord1) {
          for (const [key, value] of Object.entries(data)) {
            if (
              key !== "do" &&
              key !== "createdAt" &&
              key !== "sentence" &&
              value !== word1 &&
              !seenValues.has(value)
            ) {
              allFieldsArray.push({
                key: key,
                value: value,
                episodeID: docID,
              });
              seenValues.add(value);
              break;
            }
          }
        }
      });

      const shuffledArray = shuffleArray(allFieldsArray);
      const randomFields = shuffledArray.slice(0, 6);
      setKeywords(randomFields);

      const randomColors = randomFields.map(() => generateRandomColor());
      setColors(randomColors);
    } catch (error) {
      console.error("Error fetching subcollection documents: ", error);
    }
  }, [testerNumber, episodeType, word1]);

  // 初回レンダリングと更新時にデータ取得
  useEffect(() => {
    if (word1 && testerNumber) {
      fetchDocumentsForWord1();
    }
  }, [fetchDocumentsForWord1]);

  // 背景色の設定
  useBackgroundColor();

  // リフレッシュ時にデータ再取得
  const handleRefresh = async () => {
    await fetchDocumentsForWord1();
  };

  return (
    <div className={styles.container}>
      {/* 固定表示される選択した単語の枠 */}
      <div className={styles.selectedWordContainer}>
        <h3 className={styles.selectedWordText}>選択した単語：</h3>
        <div className={styles.selectedWordsList}>
          <span className={styles.selectedWordHighlight}>{word1}</span>
        </div>
      </div>

      {/* PullToRefreshView は単語リスト部分のみを包む */}
      <div className={styles.listContainer}>
        <PullToRefreshView onRefresh={handleRefresh}>
          <ul className={styles.list}>
            {keywords.map((item, index) => (
              <li key={index}>
                <button
                  className={styles.button}
                  style={{ borderColor: colors[index] }}
                  id={`/research/${testerNumber}/${item.episodeID}/${word1}/${item.value}`}
                  ref={addToRefs}
                >
                  {item.value}
                </button>
              </li>
            ))}
          </ul>

          <Link href={`/research/${testerNumber}`}>
            <button className={styles.backButton}>戻る</button>
          </Link>
          </PullToRefreshView>
          </div>
    </div>
  );
}
