// // Home.jsx
// "use client";

// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase"; // "@/firebase" ではなく "../firebase" を使用
// import styles from "./page.module.css";
// import { useEffect } from "react";
// import Link from "next/link";

// export default function Home() {
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const docSnap = await getDoc(doc(db, "4Wwords", "1", "episodes", "1"));
//         if (docSnap.exists()) {
//           console.log(docSnap.data());
//         } else {
//           console.log("No such document!");
//         }
//       } catch (error) {
//         console.error("Error fetching document: ", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <main className={styles.main}>
//       <h1 className={styles.title}>話題選択支援研究</h1>
//       <h2 className={styles.title}>エピソードを表示する</h2>
//       <div>
//         <Link href="/input-tester-number" passHref>
//           <button className={styles.button}>入力を開始する</button>
//         </Link>
//       </div>
//     </main>
//   );
// }

// src/index.jsx
"use client";

import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>話題選択支援研究</h1>
      <h2 className={styles.title}>エピソードを表示する</h2>
      <div>
        <Link href="/input-tester-number" passHref>
          <button className={styles.button}>入力を開始する</button>
        </Link>
      </div>
    </main>
  );
}
