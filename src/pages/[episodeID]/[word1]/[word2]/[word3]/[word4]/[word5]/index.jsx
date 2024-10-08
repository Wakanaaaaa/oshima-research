import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { SUBJECT_ID } from "@/subjectID";
import { shuffleArray } from "../../../../../../../firestoreUtils.jsx";
import {
  generateRandomColor,
  useBackgroundColor,
} from "../../../../../../../colorUtils.jsx";
import styles from "../../../../../../../styles/word.module.css";

export default function Word5() {
  const router = useRouter();
  const { episodeID, word1, word2, word3, word4, word5, color } = router.query;
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)
  const [colors, setColors] = useState([]); // カラー用のステート

  useEffect(() => {
    const fetchDocumentsForWord1 = async () => {
      try {
        // 被験者IDに基づいて、指定された単語が含まれるすべてのドキュメントを取得
        const subcollectionRef = collection(
          db,
          "4Wwords",
          SUBJECT_ID,
          "episodes"
        );

        const q = query(subcollectionRef, where("__name__", "==", episodeID));
        const subcollectionSnapshot = await getDocs(q);

        // フィールドを一つの配列にまとめる
        const allFieldsArray = [];

        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;
          // すべての関連ワードをリストに追加
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

        // ステートを更新
        setKeywords(randomFields);
        const randomColors = randomFields.map(() => generateRandomColor());
        setColors(randomColors);
      } catch (error) {
        console.error("Error fetching subcollection documents: ", error);
      }
    };

    fetchDocumentsForWord1();
  }, [episodeID, word1, word2, word3, word4, word5]);

  useBackgroundColor();

  // useEffect(() => {
  //   const backgroundColor = applyTransparency(color);
  //   document.body.style.backgroundColor = backgroundColor;
  // }, [color]);

  return (
    <div>
      <h3>
        選択した単語：[ {word1} ]---[ {word2} ]---[ {word3} ]---[ {word4} ] ---
        [ {word5}]
      </h3>
      <ul>
        {keywords.map((item, index) => (
          <ol key={index}>
            <Link
              href={{
                pathname: `/${item.episodeID}/${word1}/${word2}/${word3}/${word4}/${word5}/${item.value}`,
                query: { color: colors[index] },
              }}
            >
              <button
                className={styles.button}
                style={{ borderColor: colors[index] }}
              >
                {item.value}
              </button>
            </Link>
          </ol>
        ))}
      </ul>
      <Link
        href={{
          pathname: `/${episodeID}/${word1}/${word2}/${word3}/${word4}`,
          query: { color },
        }}
      >
        <button>戻る</button>
      </Link>
    </div>
  );
}
