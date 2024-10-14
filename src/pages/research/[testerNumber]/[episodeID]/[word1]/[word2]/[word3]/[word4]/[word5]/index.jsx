import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import styles from "../../../../../../../../../styles/word.module.css";
import { usePinchZoom } from "@/pages/usePinchZoom.jsx";

export default function Word5() {
  const router = useRouter();
  const { episodeID, word1, word2, word3, word4, word5 } = router.query;
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)
  const [colors, setColors] = useState([]); // カラー用のステート
  const { testerNumber } = router.query;
  const { addToRefs } = usePinchZoom(testerNumber); // カスタムフックの利用

  useEffect(() => {
    const fetchDocumentsForWord1 = async () => {
      try {
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
          for (const [key, value] of Object.entries(data)) {
            if (
              value !== word1 &&
              value !== word2 &&
              value !== word3 &&
              value !== word4 &&
              value !== word5
            ) {
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
  }, [episodeID, word1, word2, word3, word4, word5, testerNumber]);

  useBackgroundColor();

  return (
    <div>
      <ul className={styles.list}>
        {keywords.map((item, index) => (
          <li key={item.id || index} className={styles.listItem}>
              <button
                className={styles.button}
                style={{ borderColor: colors[index] }}
                id={`/research/${testerNumber}/${item.episodeID}/${word1}/${word2}/${word3}/${word4}/${word5}/${item.value}`}
                ref={addToRefs}
              >
                {item.value}
              </button>
          </li>
        ))}
      </ul>
      <h3>
        選択した単語：[ {word1} ]---[ {word2} ]---[ {word3} ]---[ {word4} ] ---
        [ {word5} ]
      </h3>
      <Link
        href={`/research/${testerNumber}/${episodeID}/${word1}/${word2}/${word3}/${word4}` }
      >
        <button>戻る</button>
      </Link>
    </div>
  );
}
