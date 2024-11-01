import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import styles from "../../../../../../styles/word.module.css";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";

export default function Word2() {
  const router = useRouter();
  const { episodeID, word1, word2, testerNumber } = router.query; // 必要なクエリを取得
  const [keywords, setKeywords] = useState([]); // ステート名を統一
  const [colors, setColors] = useState([]); // カラー用のステート
  const { addToRefs } = usePinchZoom(); // カスタムフックの利用
  const fieldName = "who"; // 直接取得するフィールド名を指定

  useEffect(() => {
    const fetchDocumentsForWord1 = async () => {
      try {
        // 全エピソードを取得
        const subcollectionRef = collection(
          db,
          "4Wwords",
          testerNumber,
          "episodes"
        );
        const subcollectionSnapshot = await getDocs(subcollectionRef);

        const fieldsArray = [];
        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;

          // word1とword2の両方がドキュメント内に存在するか確認
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
                allFieldsArray.push({
                  key,
                  value,
                  episodeID: docID,
                });
                seenValues.add(value); // 重複を防ぐためにセットに登録
                break; // 一つだけ追加してループを抜ける
              }
            }
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
  }, [testerNumber, episodeID, word1, word2, fieldName]);

  useBackgroundColor();

  return (
    <div>
      <h3 className={styles.selectedWord}>
        選択した単語：[ {word1} ]---[ {word2} ]
      </h3>
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
