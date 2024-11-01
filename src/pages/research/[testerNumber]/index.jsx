import { useEffect, useState} from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/router";
import { shuffleArray } from "@/firestoreUtils.jsx";
import { generateRandomColor } from "@/colorUtils.jsx";
import { usePinchZoom } from "@/hooks/usePinchZoom.jsx";
import styles from "../../../styles/word.module.css";

export default function Word1() {
  const router = useRouter();
  const { testerNumber } = router.query;
  const [keywords, setKeywords] = useState([]);
  const [colors, setColors] = useState([]);
  const { addToRefs } = usePinchZoom(testerNumber);

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const subcollectionRef = collection(
          db,
          "4Wwords",
          testerNumber,
          "episodes"
        );
        const subcollectionSnapshot = await getDocs(subcollectionRef);
        const allFieldsArray = [];
        const wordCount = {}; // 単語ごとの出現回数を追跡
        subcollectionSnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;
          for (const [key, value] of Object.entries(data)) {
            if (key !== "do" && key !== "createdAt" && key !== "sentence") {
              // 単語の初出現の場合のみ追加
              if (!wordCount[value]) {
                allFieldsArray.push({ key, value, episodeID: docID });
                wordCount[value] = 1; // 出現を記録
              }
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

    if (testerNumber) {
      fetchAllDocuments();
    }
  }, [testerNumber]);

  return (
    <div className={styles.container}>
      <br />
      <ul className={styles.list}>
        {keywords.map((item, index) => {
          return (
            <li key={item.id || index}>
              <button
                className={styles.button}
                style={{ borderColor: colors[index] }}
                id={`research/${testerNumber}/${item.episodeID}/${item.value}`}
                ref={addToRefs}
              >
                {item.value}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
