import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/router";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor, useBackgroundColor } from "@/colorUtils.jsx";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";
import styles from "@/styles/word.module.css";
import { useEpisode } from "@/contexts/EpisodeContext";
import { PullToRefreshView } from "@/PullToRefreshView";

export default function Word1() {
  const router = useRouter();
  const { testerNumber } = router.query;
  const [allKeywords, setAllKeywords] = useState([]); // 全データを保持
  const [keywordsWithColors, setKeywordsWithColors] = useState([]);
  const { addToRefs } = usePinchZoom(testerNumber);
  const { episodeType } = useEpisode();

  // ドキュメントを取得する関数
  const fetchAllDocuments = async () => {
    try {
      const subcollectionRef = collection(
        db,
        "4Wwords",
        testerNumber,
        episodeType
      );
      const subcollectionSnapshot = await getDocs(subcollectionRef);
      const allFieldsArray = [];
      const wordCount = {};
      subcollectionSnapshot.forEach((doc) => {
        const data = doc.data();
        const docID = doc.id;
        for (const [key, value] of Object.entries(data)) {
          if (key !== "do" && key !== "createdAt" && key !== "sentence") {
            if (!wordCount[value]) {
              allFieldsArray.push({ key, value, episodeID: docID });
              wordCount[value] = 1;
            }
          }
        }
      });

      // 全データをセット
      setAllKeywords(allFieldsArray);
      // 最初の表示用にランダムで6個選択
      selectRandomKeywords(allFieldsArray);
      const randomColors = randomFields.map(() => generateRandomColor());
      setColors(randomColors);
    } catch (error) {
      console.error("Error fetching subcollection documents: ", error);
    }
  };

  // ランダムに6個選択する関数
  const selectRandomKeywords = (data) => {
    const shuffledArray = shuffleArray(data);
    const randomFields = shuffledArray.slice(0, 6);
    const randomKeywordsWithColors = randomFields.map((field) => ({
      ...field,
      color: generateRandomColor(),
    }));
    setKeywordsWithColors(randomKeywordsWithColors);
  };

  useEffect(() => {
    if (testerNumber) {
      fetchAllDocuments();
    }
  }, [testerNumber, episodeType]);

  useBackgroundColor();

    // リフレッシュ時にデータ再取得
    const handleRefresh = async () => {
      await fetchAllDocuments();
    };

  return (
    <PullToRefreshView onRefresh={handleRefresh} keywordsWithColors={keywordsWithColors}>
      <ul className={styles.list0}>
        {keywordsWithColors.map((item, index) => (
          <li key={item.id || index}>
            <button
              className={styles.button}
              style={{ borderColor: item.color }}
              id={`research/${testerNumber}/${item.episodeID}/${item.value}`}
              ref={addToRefs}
            >
              {item.value}
            </button>
          </li>
        ))}
      </ul>
    </PullToRefreshView>
  );
}
