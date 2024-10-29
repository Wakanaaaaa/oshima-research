import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import styles from "../../../styles/word.module.css";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";

export default function Word1() {
  const router = useRouter();
  // const { episodeID, word1 } = router.query;
  // const [keywords, setKeywords] = useState([]);
  const [whenKeywords, setWhenKeywords] = useState([]);
  const [colors, setColors] = useState([]);
  const { testerNumber } = router.query;
  const { addToRefs } = usePinchZoom(testerNumber);

  useEffect(() => {
    const fetchWhenDocuments = async () => {
      try {
        const subcollectionRef = collection(
          db,
          "4Wwords",
          testerNumber,
          "episodes"
        );
        const subcollectionSnapshot = await getDocs(subcollectionRef);
        const whenFieldsArray = [];
        const seenValues = new Set(); // 重複を防ぐためのセット

        // 各エピソードを手動でフィルタリングし、word1を含むエピソードを見つける
        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;

          // "when" フィールドが存在し、重複していない場合のみ追加
          if (data.when && !seenValues.has(data.when)) {
            whenFieldsArray.push({
              value: data.when,
              episodeID: docID,
            });
            seenValues.add(data.when); // 重複を防ぐため、セットに追加
          }
        });

        setWhenKeywords(whenFieldsArray);
        console.log("setWhenKeywords:", whenFieldsArray);

        // 単語リストをランダムにシャッフルし、6つ取得
        const shuffledArray = shuffleArray(whenFieldsArray);
        const randomFields = shuffledArray.slice(0, 6);
        setKeywords(randomFields);

        // ランダムな色を生成
        const randomColors = randomFields.map(() => generateRandomColor());
        setColors(randomColors);
      } catch (error) {
        console.error("Error fetching subcollection documents: ", error);
      }
    };

    if (testerNumber) {
      fetchWhenDocuments();
    }
  }, [testerNumber]);

  useBackgroundColor();

  return (
    <div className={styles.container}>
      <br />
      <ul className={styles.list}>
        {whenKeywords.map((item, index) => {
          // const buttonWidth = 20; // ボタンの幅（%で想定）
          // const buttonHeight = 10; // ボタンの高さ（%で想定）
          // const randomPosition = getRandomPosition(buttonWidth, buttonHeight); // ランダム位置を生成

          return (
            <li
              key={item.id || index}
              // className={styles.listItem}
              // style={{ ...randomPosition }} // ランダムな位置を設定
            >
              <button
                className={styles.button}
                style={{ borderColor: colors[index] }}
                id={`research/${testerNumber}/${item.episodeID}/${item.value}`}
                ref={addToRefs}
              >
                {item.value}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
