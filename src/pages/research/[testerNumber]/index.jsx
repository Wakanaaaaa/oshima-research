import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../../styles/word.module.css";
import { fetchFirestoreData, shuffleArray } from "../../../firestoreUtils.jsx";
import { generateRandomColor } from "../../../colorUtils.jsx";
import { usePinchZoom } from "../../../hooks/usePinchZoom";

export default function Word1() {
  const router = useRouter();
  const { testerNumber } = router.query;
  console.log("testerNumber::::", testerNumber);
  const [keywords, setKeywords] = useState([]);
  const [colors, setColors] = useState([]);
  const { addToRefs } = usePinchZoom(testerNumber);

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const allFieldsArray = await fetchFirestoreData(testerNumber);
        const shuffledArray = shuffleArray(allFieldsArray);
        const randomFields = shuffledArray.slice(0, 6);
        setKeywords(randomFields);

        const randomColors = randomFields.map(() => generateRandomColor());
        setColors(randomColors);
      } catch (error) {
        console.error("Error fetching subcollection documents: ", error);
      }
    };

    fetchAllDocuments();
  }, [testerNumber]);

  // TesterNumberの確認
  useEffect(() => {
    console.log("Tester Numberrrrrrr111111: ", testerNumber);
  }, [testerNumber]);

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {keywords.map((item, index) => (
          <li key={item.id || index} className={styles.listItem}>
            <button
              className={styles.button}
              style={{ borderColor: colors[index] }}
              id={`research/${testerNumber}/${item.episodeID}/${item.value}`}
              ref={addToRefs}
            >
              {item.value}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
