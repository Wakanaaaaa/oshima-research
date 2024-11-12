import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import styles from "@/styles/word.module.css";
import { useEpisode } from "@/contexts/EpisodeContext";

export default function Word5() {
  const router = useRouter();
  const { episodeID, word1, word2, word3, word4, word5 } = router.query;
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)
  const [colors, setColors] = useState([]); // カラー用のステート
  const { testerNumber } = router.query;
  const fieldName = "thoughts"; // 直接取得するフィールド名を指定
  const { episodeType } = useEpisode();

  useEffect(() => {
    const fetchDocumentsForWord1 = async () => {
      try {
        const subcollectionRef = collection(
          db,
          "4Wwords",
          testerNumber,
          episodeType
        );

        const subcollectionSnapshot = await getDocs(subcollectionRef);

        const fieldsArray = [];
        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;

          // 重複を避け、指定されたフィールドが存在するエピソードを収集
          if (
            data[fieldName] &&
            data.when === word1 &&
            data.where === word2 &&
            data.who === word3 &&
            data.what === word4 &&
            !fieldsArray.some((item) => item.value === data[fieldName]) // 重複チェック
          ) {
            fieldsArray.push({
              value: data[fieldName],
              episodeID: docID,
            });
          }
        });

        const shuffledArray = shuffleArray(fieldsArray);
        const randomFields = shuffledArray.slice(0, 6);
        setKeywords(randomFields);
        const randomColors = randomFields.map(() => generateRandomColor());
        setColors(randomColors);
      } catch (error) {
        console.error("Error fetching subcollection documents: ", error);
      }
    };

    if (testerNumber && fieldName) {
      fetchDocumentsForWord1();
    }
  }, [episodeID, word1, word2, word3, word4, word5, testerNumber, episodeType]);

  useBackgroundColor();

  return (
    <div>
      <div className={styles.selectedWordContainer}>
        <h3 className={styles.selectedWordText}>選択した単語：</h3>
        <div className={styles.selectedWordsList}>
          <span className={styles.selectedWordHighlight}>{word1}</span>
          <span className={styles.selectedWordHighlight}>{word2}</span>
          <span className={styles.selectedWordHighlight}>{word3}</span>
          <span className={styles.selectedWordHighlight}>{word4}</span>
          <span className={styles.selectedWordHighlight}>{word5}</span>
        </div>
      </div>
      <Link
        href={`/research/${testerNumber}/${episodeID}/${word1}/${word2}/${word3}/${word4}`}
      >
        <button className={styles.backButton}>戻る</button>
      </Link>
    </div>
  );
}
