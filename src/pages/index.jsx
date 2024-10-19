"use client";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import styles from "../styles/word.module.css";
import { useEffect, useState } from "react"; // useStateを追加
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [testerNumber, setTesterNumber] = useState(""); // 被験者番号を保存する状態を追加

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(doc(db, "4Wwords", "1", "episodes", "1"));
      console.log(docSnap.data());
    };
    fetchData();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
    if (testerNumber) {
      router.push(`/research/${testerNumber}`); // 被験者番号を使って遷移
    } else {
      console.error("Tester Number is not provided.");
    }
  };

  const handleInputChange = (e) => {
    setTesterNumber(e.target.value); // 入力された値を更新
  };


  return (
    <main className={styles.main}>
      <h2 className={styles.title}>被験者番号を入力してください</h2>

      <form action="post" onSubmit={onSubmit}>
        <label htmlFor="tester-number">被験者番号</label>
        <input 
          id="tester-number" 
          type="number" 
          value={testerNumber} // 状態をinputの値として設定
          onChange={handleInputChange} // 値が変更されたら状態を更新
        />

        <button type="submit">OK</button>
      </form>
    </main>
  );
}
