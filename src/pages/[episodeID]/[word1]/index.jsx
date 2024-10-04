import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { SUBJECT_ID } from "@/subjectID";
import { shuffleArray } from "../../../firestoreUtils.jsx";
import {
  generateRandomColor,
  useBackgroundColor,
} from "../../../colorUtils.jsx";
import styles from "../../../styles/word.module.css";

export default function Word1() {
  const router = useRouter();
  const { episodeID, word1 } = router.query; // クエリからword1とcolorを取得
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)
  const [colors, setColors] = useState([]); // カラー用のステート

  useEffect(() => {
    const fetchDocumentsForWord1 = async () => {
      try {
        // Firestoreのコレクションからデータを取得
        const subcollectionRef = collection(
          db,
          "4Wwords",
          SUBJECT_ID,
          "episodes"
        );

        const q = query(subcollectionRef, where("__name__", "==", episodeID));
        const subcollectionSnapshot = await getDocs(q);

        // データを一時的に格納する配列
        const allFieldsArray = [];

        // 各ドキュメントをチェック
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
        // ステートを更新
        setKeywords(randomFields);

        const randomColors = randomFields.map(() => generateRandomColor());
        setColors(randomColors);
      } catch (error) {
        console.error("Error fetching subcollection documents: ", error);
      }
    };

    fetchDocumentsForWord1();
  }, [episodeID, word1]);

  useBackgroundColor();
  
  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <h3>選択した単語：[ {word1} ]</h3>
      <ul>
        {keywords.map((item, index) => (
          <ol key={index}>
            <Link
              href={{
                pathname: `/${item.episodeID}/${word1}/${item.value}`,
                query: { color: colors[index] }, // 現在の背景色を次のページに引き継ぐ
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
      <Link href="/">
        <button>戻る</button>
      </Link>
    </div>
  );
}
