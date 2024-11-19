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

export default function Word2() {
  const router = useRouter();
  const { episodeID, word1, word2 } = router.query;
  const [keywords, setKeywords] = useState([]);
  const [colors, setColors] = useState([]);
  const { testerNumber } = router.query;
  const { addToRefs } = usePinchZoom();
  const { episodeType } = useEpisode();

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

        const containsWord1 = Object.values(data).includes(word1);
        const containsWord2 = Object.values(data).includes(word2);

        if (containsWord1 && containsWord2) {
          for (const [key, value] of Object.entries(data)) {
            if (
              key !== "do" &&
              key !== "createdAt" &&
              key !== "sentence" &&
              value !== word1 &&
              value !== word2 &&
              !seenValues.has(value)
            ) {
              allFieldsArray.push({ key, value, episodeID: docID });
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
  }, [episodeType, testerNumber, word1, word2]);

  useEffect(() => {
    if (word1 && word2 && testerNumber) {
      fetchDocumentsForWord1();
    }
  }, [fetchDocumentsForWord1]);

  useBackgroundColor();

  const handleRefresh = async () => {
    await fetchDocumentsForWord1();
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectedWordContainer}>
        <h3 className={styles.selectedWordText}>選択した単語：</h3>
        <div className={styles.selectedWordsList}>
          <span className={styles.selectedWordHighlight}>{word1}</span>
          <span className={styles.selectedWordHighlight}>{word2}</span>
        </div>
      </div>

      <div className={styles.listContainer}>
        <PullToRefreshView onRefresh={handleRefresh}>
          <ul className={styles.list}>
            {keywords.map((item, index) => (
              <li key={index}>
                <button
                  className={styles.button}
                  style={{ borderColor: colors[index] }}
                  id={`/research/${testerNumber}/${item.episodeID}/${word1}/${word2}/${item.value}`}
                  ref={addToRefs}
                >
                  {item.value}
                </button>
              </li>
            ))}
          </ul>

          <Link href={`/research/${testerNumber}/${episodeID}/${word1}`}>
            <button className={styles.backButton}>戻る</button>
          </Link>
        </PullToRefreshView>
      </div>
    </div>
  );
}
