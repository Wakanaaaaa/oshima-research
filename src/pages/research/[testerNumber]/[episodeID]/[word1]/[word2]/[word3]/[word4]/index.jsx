import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import styles from "../../../../../../../../styles/word.module.css";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";

export default function Word4() {
  const router = useRouter();
  const { episodeID, word1, word2, word3, word4 } = router.query;
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)
  const [colors, setColors] = useState([]); // カラー用のステート
  const { testerNumber } = router.query;
  const { addToRefs } = usePinchZoom(testerNumber); // カスタムフックの利用
  const fieldName = "thoughts"; // 直接取得するフィールド名を指定

  useEffect(() => {
    const fetchDocumentsForWord1 = async () => {
      try {
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

          // 重複を避け、指定されたフィールドが存在するエピソードを収集
          if (
            data[fieldName] &&
            data.when === word1 &&
            data.where === word2 &&
            data.who === word3 &&
            data.what === word4 &&
            !fieldsArray.some((item) => item.value === data[fieldName]) // 重複チェック
          ) {
            for (const [key, value] of Object.entries(data)) {
              if (
                key !== "do" &&
                key !== "createdAt" &&
                key !== "sentence" &&
                value !== word1 &&
                value !== word2 &&
                value !== word3 &&
                value !== word4 &&
                !seenValues.has(value)
              ) {
                allFieldsArray.push({
                  key,
                  value,
                  episodeID: docID,
                });
                seenValues.add(value); // 重複を防ぐためにセットに登録
                break;
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
  }, [episodeID, word1, word2, word3, word4, testerNumber, fieldName]);

  useBackgroundColor();

  return (
    <div>
      <h3 className={styles.selectedWord}>
        選択した単語：[ {word1} ]---[ {word2} ]---[ {word3} ]---[ {word4} ]
      </h3>
      <ul className={styles.list}>
        {keywords.map((item, index) => (
          <li key={item.id || index}>
            <button
              className={styles.button}
              style={{ borderColor: colors[index] }}
              id={`/research/${testerNumber}/${item.episodeID}/${word1}/${word2}/${word3}/${word4}/${item.value}`}
              ref={addToRefs}
            >
              {item.value}
            </button>
          </li>
        ))}
      </ul>

      <Link
        href={`/research/${testerNumber}/${episodeID}/${word1}/${word2}/${word3}`}
      >
        <button className={styles.backButton}>戻る</button>
      </Link>
    </div>
  );
}
