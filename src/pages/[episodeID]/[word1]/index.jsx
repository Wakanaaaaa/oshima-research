import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { SUBJECT_ID } from "@/subjectID";
import styles from "../../../styles/word.module.css";

export default function Word1() {
  const router = useRouter();
  const { word1, color } = router.query; // クエリからword1とcolorを取得
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)
  const [bgColor, setBgColor] = useState("#fff"); // デフォルトの背景色

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
        const subcollectionSnapshot = await getDocs(subcollectionRef);

        // データを一時的に格納する配列
        const allFieldsArray = [];

        // 各ドキュメントをチェック
        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;

          // 指定された `word1` を含むドキュメントを検索
          if (Object.values(data).includes(word1)) {
            // `word1` 以外の単語を配列に追加
            for (const [key, value] of Object.entries(data)) {
              if (value !== word1) {
                allFieldsArray.push({ key, value, episodeID: docID });
              }
            }
          }
        });

        // 重複する単語を削除
        const uniqueKeywords = new Map();
        allFieldsArray.forEach((item) => {
          if (!uniqueKeywords.has(item.value)) {
            uniqueKeywords.set(item.value, item);
          }
        });
        const uniqueFieldsArray = Array.from(uniqueKeywords.values());

        // 配列をシャッフルして6個のランダムな項目を選択
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

  // クエリで渡された背景色を設定
  useEffect(() => {
    if (color) {
      setBgColor(hexToRgba(color, 0.5)); // 50%透明度
    }
  }, [color]);

  // HEXカラーをRGBAに変換する関数
  const hexToRgba = (hex, alpha) => {
    let r = 0,
      g = 0,
      b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <div
      style={{ backgroundColor: bgColor, minHeight: "100vh", padding: "20px" }}
    >
      <h3>選択した単語：[ {word1} ]</h3>
      <ul>
        {keywords.map((item, index) => (
          <ol key={index}>
            <Link
              href={{
                pathname: `/${item.episodeID}/${word1}/${item.value}`,
                query: { color: bgColor }, // 現在の背景色を次のページに引き継ぐ
              }}
            >
              <button className={styles.button}>{item.value}</button>
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
