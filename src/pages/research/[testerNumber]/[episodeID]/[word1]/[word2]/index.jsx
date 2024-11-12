import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import styles from "@/styles/word.module.css";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";
import { useEpisode } from "@/contexts/EpisodeContext";

export default function Word2() {
  const router = useRouter();
  const { episodeID, word1, word2, testerNumber } = router.query; // 必要なクエリを取得
  const [keywords, setKeywords] = useState([]); // ステート名を統一
  const [colors, setColors] = useState([]); // カラー用のステート
  const { addToRefs } = usePinchZoom(); // カスタムフックの利用
  const fieldName = "who"; // 直接取得するフィールド名を指定
  const { episodeType } = useEpisode();

  useEffect(() => {
    const fetchDocumentsForWord1 = async () => {
      try {
        // 全エピソードを取得
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
  }, [testerNumber, episodeID, word1, word2, fieldName, episodeType]);

  useBackgroundColor();

  return (
    <div>
      <div className={styles.selectedWordContainer}>
        <h3 className={styles.selectedWordText}>選択した単語：</h3>
        <div className={styles.selectedWordsList}>
          <span className={styles.selectedWordHighlight}>{word1}</span>
          <span className={styles.selectedWordHighlight}>{word2}</span>
        </div>
      </div>
      <ul className={styles.list}>
        {keywords.map((item, index) => (
          <li key={item.episodeID || index}>
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
    </div>
  );
}
