import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import styles from "../../../../../styles/word.module.css";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";

export default function Word2() {
  const router = useRouter();
  const { testerNumber, episodeID, word1 } = router.query;
  const [whereKeywords, setWhereKeywords] = useState([]);
  const [colors, setColors] = useState([]);
  const { addToRefs } = usePinchZoom(testerNumber);

  useEffect(() => {
    const fetchWhereDocuments = async () => {
      try {
        // すべてのエピソードを取得
        const subcollectionRef = collection(
          db,
          "4Wwords",
          testerNumber,
          "episodes"
        );
        const subcollectionSnapshot = await getDocs(subcollectionRef);

        const whereArray = [];
        const seenValues = new Set(); // 重複を防ぐためのセット

        // 各エピソードを確認し、選択した単語（word1）が含まれるエピソードの`where`フィールドを収集
        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;

          // word1を含むエピソードの場合、そのエピソードのwhere要素を追加
          for (const [key, value] of Object.entries(data)) {
            if (value === word1 && data.where && !seenValues.has(data.where)) {
              whereArray.push({
                value: data.where,
                episodeID: docID,
              });
              seenValues.add(data.where);
              break; // word1を含むエピソードが見つかったので次のドキュメントへ
            }
          }
        });

        // データをシャッフルし、最大6つ取得
        const shuffledArray = shuffleArray(whereArray);
        const randomFields = shuffledArray.slice(0, 6);
        setWhereKeywords(randomFields);

        // ランダムな色を生成
        const randomColors = randomFields.map(() => generateRandomColor());
        setColors(randomColors);
      } catch (error) {
        console.error("Error fetching where data: ", error);
      }
    };

    if (episodeID && testerNumber) {
      fetchWhereDocuments();
    }
  }, [episodeID, testerNumber, word1]);

  useBackgroundColor();

  return (
    <div>
      {/* 選択した単語を表示 */}
      <div className={styles.selectedWordContainer}>
        <h3 className={styles.selectedWordText}>選択した単語：</h3>
        <div className={styles.selectedWordsList}>
          <span className={styles.selectedWordHighlight}>{word1}</span>
        </div>
      </div>
      <ul className={styles.list}>
        {whereKeywords.map((item, index) => (
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

      {/* 戻るボタン */}
      <Link href={`/research/${testerNumber}`}>
        <button className={styles.backButton}>戻る</button>
      </Link>
    </div>
  );
}
