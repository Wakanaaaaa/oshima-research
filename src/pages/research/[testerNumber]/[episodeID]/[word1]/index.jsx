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

        // 各エピソードをチェック
        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;

          // word1を含むエピソードかどうか確認
          let hasWord1 = false;
          for (const [key, value] of Object.entries(data)) {
            if (value === word1) {
              hasWord1 = true;
              break; // word1が見つかったら終了
            }
          }

          // word1を含む場合、1つの他のフィールドを抽出
          if (hasWord1) {
            for (const [key, value] of Object.entries(data)) {
              if (
                key !== "do" &&
                key !== "createdAt" &&
                key !== "sentence" && 
                value !== word1 && // word1 以外
                !seenValues.has(value) // 重複を避ける
              ) {
                allFieldsArray.push({
                  key: key,
                  value: value,
                  episodeID: docID,
                });
                seenValues.add(value); // 一度追加したらセットに登録
                break; // 1つフィールドを見つけたら次のエピソードへ
              }
            }
          }
        });

        // 単語リストをランダムにシャッフルし、6つ取得
        const shuffledArray = shuffleArray(allFieldsArray);
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
      <h3 className={styles.selectedWord}>選択した単語：[ {word1} ]</h3>

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
