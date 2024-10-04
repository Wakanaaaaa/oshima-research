import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { SUBJECT_ID } from "@/subjectID";
import { shuffleArray } from "../../../../firestoreUtils.jsx";
import { hexToRgba } from "../../../../colorUtils.jsx";

export default function Word2() {
  const router = useRouter();
  const { episodeID, word1, word2, color } = router.query;
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)
  const [bgColor, setBgColor] = useState("#fff"); // デフォルトの背景色


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

        // フィールドを一つの配列にまとめる
        const allFieldsArray = [];

        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;

          // すべての関連ワードをリストに追加
          for (const [key, value] of Object.entries(data)) {
            if (value !== word1 && value !== word2) {
              allFieldsArray.push({ key, value, episodeID: docID });
            }
          }
        });

        const shuffledArray = shuffleArray(allFieldsArray);
        const randomFields = shuffledArray.slice(0, 6);

        // ステートを更新
        setKeywords(randomFields);
      } catch (error) {
        console.error("Error fetching subcollection documents: ", error);
      }
    };

    fetchDocumentsForWord1();
  }, [episodeID, word1, word2]);

    // クエリで渡された背景色を設定
    useEffect(() => {
      if (color) {
        setBgColor(hexToRgba(color, 0.25)); // 50%透明度
      }
    }, [color]);

  return (
    <div>
      <h3>
        選択した単語：[ {word1} ]---[ {word2} ]
      </h3>
      <ul>
        {keywords.map((item, index) => (
          <ol key={index}>
            <Link href={`/${item.episodeID}/${word1}/${word2}/${item.value}`}>
              <button>{item.value}</button>
            </Link>
          </ol>
        ))}
      </ul>
      <Link href={`/${episodeID}/${word1}`}>
        <button>戻る</button>
      </Link>
    </div>
  );
}
