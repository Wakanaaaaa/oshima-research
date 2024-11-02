"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../../../firebase";

export default function SentenceList() {
  const router = useRouter();
  const { testerNumber } = router.query;
  const [sentences, setSentences] = useState([]);

  useEffect(() => {
    if (!testerNumber) return;

    const fetchSentences = async () => {
      try {
        const episodesRef = collection(db, "4Wwords", testerNumber, "episodeC");
        const querySnapshot = await getDocs(episodesRef);

        // sentence フィールドが存在するドキュメントのみフィルタリング
        const filteredSentences = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((data) => data.sentence) // sentenceフィールドが存在するもののみを取得
          .map((data) => data.sentence);

        setSentences(filteredSentences);
      } catch (error) {
        console.error("Error fetching sentences: ", error);
      }
    };

    fetchSentences();
  }, [testerNumber]);

  return (
    <div>
      <h1>Sentences for Tester {testerNumber}</h1>
      <ul>
        {sentences.length > 0 ? (
          sentences.map((sentence, index) => (
            <li key={index}>{sentence}</li>
          ))
        ) : (
          <p>No sentences available for this tester.</p>
        )}
      </ul>
    </div>
  );
}
