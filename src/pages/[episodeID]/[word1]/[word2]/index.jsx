import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { SUBJECT_ID } from "@/subjectID";
import { shuffleArray } from "../../../../firestoreUtils.jsx";
import {
  generateRandomColor,
  useBackgroundColor,
} from "../../../../colorUtils.jsx";
import styles from "../../../../styles/word.module.css";

export default function Word2() {
  const router = useRouter();
  const { episodeID, word1, word2, color } = router.query; // colorクエリパラメータを追加
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)
  const [colors, setColors] = useState([]); // カラー用のステート

  useEffect(() => {
    const fetchDocumentsForWord1 = async () => {
      try {
        const subcollectionRef = collection(
          db,
          "4Wwords",
          SUBJECT_ID,
          "episodes"
        );

        const q = query(subcollectionRef, where("__name__", "==", episodeID));
        const subcollectionSnapshot = await getDocs(q);

        const allFieldsArray = [];

        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;
          for (const [key, value] of Object.entries(data)) {
            if (value !== word1 && value !== word2) {
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
  }, [episodeID, word1, word2]);

  useBackgroundColor();

  return (
    <div>

      <ul className={styles.list}>
        {keywords.map((item, index) => (
          <li key={item.id || index} className={styles.listItem}>
            <Link
              href={{
                pathname: `/${item.episodeID}/${word1}/${word2}/${item.value}`,
                query: { color: colors[index] }, // 現在の背景色を次のページに引き継ぐ
              }}
              passHref
            >
              <button
                className={styles.button}
                style={{ borderColor: colors[index] }}
              >
                {item.value}
              </button>
            </Link>
          </li>
        ))}
      </ul>
      <h3>
        選択した単語：[ {word1} ]---[ {word2} ]
      </h3>
      <Link href={{ pathname: `/${episodeID}/${word1}`, query: { color } }}>
        <button>戻る</button>
      </Link>
    </div>
  );
}
