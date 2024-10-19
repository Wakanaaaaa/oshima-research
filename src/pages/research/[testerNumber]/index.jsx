import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor } from "@/colorUtils.jsx";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import styles from "../../../styles/word.module.css";

export default function Word1() {
  const router = useRouter();
  const { testerNumber } = router.query;
  const [keywords, setKeywords] = useState([]);
  const [colors, setColors] = useState([]);
  const { addToRefs } = usePinchZoom(testerNumber);

  const positions = useRef([]); // 配置された要素の位置を保存する

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const subcollectionRef = collection(
          db,
          "4Wwords",
          testerNumber,
          "episodes"
        );
        const subcollectionSnapshot = await getDocs(subcollectionRef);
        const allFieldsArray = [];
        const uniqueValues = new Set(); // 重複を排除するためのセット

        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;
          for (const [key, value] of Object.entries(data)) {
            if (key !== "do" && !uniqueValues.has(value)) {
              allFieldsArray.push({ key, value, episodeID: docID });
              uniqueValues.add(value); // 値をセットに追加
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
    };

    if(testerNumber){
    fetchAllDocuments();
  }
  }, [testerNumber]);

  const checkOverlap = (newPosition, width, height) => {
    for (let pos of positions.current) {
      const overlapX =
        newPosition.left < pos.left + pos.width &&
        newPosition.left + width > pos.left;
      const overlapY =
        newPosition.top < pos.top + pos.height &&
        newPosition.top + height > pos.top;
      if (overlapX && overlapY) {
        return true; // オーバーラップしている
      }
    }
    return false; // オーバーラップしていない
  };
  

  const getRandomPosition = (width, height) => {
    let randomTop, randomLeft;
    let newPosition;
    let overlap;

    do {
      randomTop = Math.random() * (90 - height); // 画面の範囲内に収める
      randomLeft = Math.random() * (90 - width); // 画面の範囲内に収める      
      newPosition = { top: randomTop, left: randomLeft };
      overlap = checkOverlap(newPosition, width, height);
    } while (overlap);

    positions.current.push({ ...newPosition, width, height }); // 新しい位置を保存
    return { top: `${randomTop}%`, left: `${randomLeft}%` };
  };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {keywords.map((item, index) => {
          const buttonWidth = 20; // ボタンの幅（%で想定）
          const buttonHeight = 10; // ボタンの高さ（%で想定）
          const randomPosition = getRandomPosition(buttonWidth, buttonHeight); // ランダム位置を生成

          return (
            <li
              key={item.id || index}
              // className={styles.listItem}
              style={{ ...randomPosition }} // ランダムな位置を設定
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
