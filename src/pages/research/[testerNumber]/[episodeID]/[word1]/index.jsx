import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import styles from "../../../../../styles/word.module.css";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";

export default function Word1() {
  const router = useRouter();
  const { episodeID, word1 } = router.query;
  const [keywords, setKeywords] = useState([]);
  const [colors, setColors] = useState([]);
  const { testerNumber } = router.query;
  const { addToRefs } = usePinchZoom(testerNumber);

  useEffect(() => {
    const fetchDocumentsForWord1 = async () => {
      try {
        // Firestoreのコレクションからデータを取得
        const subcollectionRef = collection(
          db,
          "4Wwords",
          testerNumber,
          "episodes"
        );

        // すべてのエピソードを取得
        const subcollectionSnapshot = await getDocs(subcollectionRef);

        const allFieldsArray = [];
        const seenValues = new Set();  // 重複を防ぐためのセット

        // 各エピソードを手動でフィルタリングし、word1を含むエピソードを見つける
        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;

          // ドキュメント内のフィールドをチェックし、word1が含まれているか確認
          for (const [key, value] of Object.entries(data)) {
            if (value === word1) {
              // word1を含むエピソードの場合、そのエピソード内の他のフィールドを追加
              for (const [innerKey, innerValue] of Object.entries(data)) {
                if (innerKey !== "do" && innerValue !== word1 && !seenValues.has(innerValue)) {
                  allFieldsArray.push({
                    key: innerKey,
                    value: innerValue,
                    episodeID: docID,
                  });
                  seenValues.add(innerValue);  // 単語を追加したらセットに登録
                }
              }
              break; // word1を含むエピソードが見つかったので次のドキュメントへ
            }
          }
        });

        // 単語リストをランダムにシャッフルし、6つ取得
        const shuffledArray = shuffleArray(allFieldsArray);
        const randomFields = shuffledArray.slice(0, 6);
        setKeywords(randomFields);

        // ランダムな色を生成
        const randomColors = randomFields.map(() => generateRandomColor());
        setColors(randomColors);
      } catch (error) {
        console.error("Error fetching subcollection documents: ", error);
      }
    };

    if (word1 && testerNumber) {
      fetchDocumentsForWord1();
    }
  }, [episodeID, word1, testerNumber]);

  useBackgroundColor();

  return (
    <div>
      {/* 選択した単語の表示をボタンリストの上に移動 */}
      <h3 className={styles.selectedWord}>選択した単語：[ {word1} ]</h3>

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

      {/* 戻るボタン */}
      <Link href={`/research/${testerNumber}`}>
        <button className={styles.backButton}>戻る</button>
      </Link>
    </div>
  );
}
