import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import styles from "../../../../../../styles/word.module.css";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";

export default function Word2() {
  const router = useRouter();
  const { episodeID, word1, word2 } = router.query;
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)
  const [colors, setColors] = useState([]); // カラー用のステート
  const { testerNumber } = router.query;
  const { addToRefs } = usePinchZoom(); // カスタムフックの利用

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
            if (key !== "do" && value !== word1 && value !== word2) {
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
  }, [episodeID, word1, word2, testerNumber]);

  useBackgroundColor();

  return (
    <div>
      <h3 className={styles.selectedWord}>
        選択した単語：[ {word1} ]---[ {word2} ]
      </h3>
      <ul className={styles.list}>
        {keywords.map((item, index) => (
          <li key={item.id || index}>
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
