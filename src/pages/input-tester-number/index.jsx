// // sentence/[testerNumber]/index.jsx
// "use client";
// import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../firebase";
// import { useRouter } from "next/router";

// export default function SentenceList() {
//   const router = useRouter();
//   const { testerNumber } = router.query;
//   const [sentences, setSentences] = useState([]);

//   useEffect(() => {
//     if (!testerNumber) return;

//     const fetchSentences = async () => {
//       try {
//         const docRef = doc(db, "4Wwords", testerNumber, "episodes", "1"); // testerNumberを使用してドキュメント取得
//         const docSnap = await getDoc(docRef);
        
//         if (docSnap.exists()) {
//           setSentences(docSnap.data().sentences); // sentences配列をセット
//         } else {
//           console.log("No such document!");
//         }
//       } catch (error) {
//         console.error("Error fetching sentences: ", error);
//       }
//     };

//     fetchSentences();
//   }, [testerNumber]);

//   return (
//     <div>
//       <h1>Sentences for Tester {testerNumber}</h1>
//       <ul>
//         {sentences && sentences.length > 0 ? (
//           sentences.map((sentence, index) => (
//             <li key={index}>{sentence}</li>
//           ))
//         ) : (
//           <p>No sentences available for this tester.</p>
//         )}
//       </ul>
//     </div>
//   );
// }

// src/input-tester-number/index.jsx
"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function InputTesterNumber() {
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    const testerNumber = e.target[0].value;
    if (testerNumber) {
      router.push(`/sentence/${testerNumber}`);
    }
  };

  return (
    <main className={styles.main}>
      <h2 className={styles.title}>実験参加者番号を入力してください</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="tester-number">実験参加者番号</label>
        <input id="tester-number" type="number" required />
        <button type="submit">OK</button>
      </form>
    </main>
  );
}

