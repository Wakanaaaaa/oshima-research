import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { SUBJECT_ID } from "@/subjectID";

export default function Word1() {
  const router = useRouter();
  const { episodeID, word1 } = router.query;
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)

  useEffect(() => {
    const fetchDocumentsForEpisode1 = async () => {
      try {
        // 被験者IDが1のドキュメントのみを取得
        const subcollectionRef = collection(
          db,
          "4Wwords",
          SUBJECT_ID,
          "episodes"
        );

        const q = query(subcollectionRef, where("__name__", "==", episodeID)); // "__name__"はFirestoreでドキュメントIDを示します
        const subcollectionSnapshot = await getDocs(q);
        console.log("ドキュメントID:", subcollectionSnapshot);

        // フィールドを一つの配列にまとめる
        const allFieldsArray = [];

        //Firestoreから取得したデータを一時的に格納し、後でステートに設定するための作業用配列
        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;

          // ドキュメントのデータを配列に追加
          for (const [key, value] of Object.entries(data)) {
            if (!word1 || value !== word1) {
              allFieldsArray.push({ key, value, episodeID: docID });
            }
          }
        });

        // 配列をシャッフルする関数
        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };

        // 配列をシャッフルし、最初の6個を取得
        const shuffledArray = shuffleArray(allFieldsArray);
        const randomFields = shuffledArray.slice(0, 6);

        // ステートを更新
        setKeywords(randomFields);
      } catch (error) {
        console.error("Error fetching subcollection documents: ", error);
      }
    };

    fetchDocumentsForEpisode1();
  }, [episodeID, word1]);

  return (
    <div>
      <h3>firebaseからのキーワード:</h3>
      <h3>選択した単語：{word1}</h3>
      <ul>
        {keywords.map((item, index) => (
          <li key={index}>
            <Link
              href={{
                pathname: `/${item.episodeID}/${word1}`,
                query: { word1: item.value },
              }}
            >
              <button>
                {item.key}: {item.value}
              </button>
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
