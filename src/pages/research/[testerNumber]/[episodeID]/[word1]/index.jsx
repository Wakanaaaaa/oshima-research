import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import styles from "../../../../../styles/word.module.css";
import { usePinchZoom } from "@/pages/usePinchZoom.jsx";

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

        const q = query(subcollectionRef, where("__name__", "==", episodeID));
        const subcollectionSnapshot = await getDocs(q);

        const allFieldsArray = [];

        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;
          // すべての関連ワードをリストに追加
          for (const [key, value] of Object.entries(data)) {
            if (value !== word1) {
              allFieldsArray.push({ key, value, episodeID: docID });
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

    fetchDocumentsForWord1();
  }, [episodeID, word1, testerNumber]);

  useBackgroundColor();

  useEffect(() => {
    if (!testerNumber) {
      console.error("Tester Number is undefined.");
    } else {
      console.log("Tester Number:", testerNumber);
    }
  }, [testerNumber]);

  return (
    <div>
      <ul className={styles.list}>
        {keywords.map((item, index) => (
          <li key={item.id || index} className={styles.listItem}>
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
      <h3>選択した単語：[ {word1} ]</h3>
      <Link href={`/research/${testerNumber}`}>
        <button>戻る</button>
      </Link>
    </div>
  );
}
