import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/word.module.css";
import { fetchFirestoreData, shuffleArray } from "../firestoreUtils.jsx";
import { generateRandomColor } from "../colorUtils.jsx";

export default function Word1() {
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)
  const [colors, setColors] = useState([]); //枠のカラー

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const allFieldsArray = await fetchFirestoreData();
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

    fetchAllDocuments();
  }, []);

  return (
    <div>
      <ul>
        {keywords.map((item, index) => (
          <ol key={index}>
            <Link
              href={{
                pathname: `/${item.episodeID}/${item.value}`,
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
    </div>
  );
}
