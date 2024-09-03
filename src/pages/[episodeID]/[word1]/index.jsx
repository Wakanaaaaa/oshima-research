import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { SUBJECT_ID } from "@/subjectID";

export default function Word1() {
  const router = useRouter();
  // const { episodeID, word1 } = router.query;
  const { word1 } = router.query;
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)

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

        const subcollectionSnapshot = await getDocs(subcollectionRef);

        // フィールドを一つの配列にまとめる
        const allFieldsArray = [];

        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;

          if (Object.values(data).includes(word1)) {
            // そのエピソード内の `word1` 以外の単語をリストに追加
            for (const [key, value] of Object.entries(data)) {
              if (value !== word1) {
                allFieldsArray.push({ key, value, episodeID: docID });
              }
            }
          }
        });

        // 重複する単語を削除するために、単語のセットを使って一意の単語を保持
        const uniqueKeywords = new Map();

        allFieldsArray.forEach((item) => {
          if (!uniqueKeywords.has(item.value)) {
            uniqueKeywords.set(item.value, item);
          }
        });

        const uniqueFieldsArray = Array.from(uniqueKeywords.values());

        // シャッフルとランダムな選択は任意で
        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };

        const shuffledArray = shuffleArray(uniqueFieldsArray);
        const randomFields = shuffledArray.slice(0, 6);

        // ステートを更新
        setKeywords(randomFields);
      } catch (error) {
        console.error("Error fetching subcollection documents: ", error);
      }
    };

    if (word1) {
      fetchDocumentsForWord1();
    }
  }, [word1]);

  return (
    <div>
      <h3>firebaseからのキーワード:</h3>
      <h3>選択した単語：[ {word1} ]</h3>
      <ul>
        {keywords.map((item, index) => (
          <li key={index}>
            <Link href={`/${item.episodeID}/${word1}/${item.value}`}>
              <button>{item.value}</button>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/">
        <button>戻る</button>
      </Link>
    </div>
  );
}
