import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/router";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor } from "@/colorUtils.jsx";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";
import styles from "@/styles/word.module.css";
import { useEpisode } from "@/contexts/EpisodeContext";
import ShuffleOnPull from "@/ShuffleOnPull";

export default function Word1() {
  const router = useRouter();
  const { testerNumber } = router.query;
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

      const shuffledArray = shuffleArray(allFieldsArray);
      const randomFields = shuffledArray.slice(0, 6);

      // 単語とその色をペアにして保存
      const randomKeywordsWithColors = randomFields.map((field) => ({
        ...field,
        color: generateRandomColor(),
      }));

      setKeywordsWithColors(randomKeywordsWithColors);
    } catch (error) {
      console.error("Error fetching subcollection documents: ", error);
    }
  };

  // シャッフル関数
  const handleShuffle = () => {
    const shuffledKeywordsWithColors = shuffleArray(
      keywordsWithColors.map((item) => ({
        ...item,
        color: generateRandomColor(),
      }))
    );
    setKeywordsWithColors(shuffledKeywordsWithColors);
  };

  useEffect(() => {
    if (testerNumber) {
      fetchAllDocuments();
    }
  }, [testerNumber, episodeType]);

  return (
    <ShuffleOnPull keywordsWithColors={keywordsWithColors} onShuffle={handleShuffle}>
      <ul className={styles.list}>
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
    </ShuffleOnPull>
  );
}
