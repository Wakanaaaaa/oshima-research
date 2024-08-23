import Link from "next/link";
import { useEffect } from "react";
import { getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { collection } from "firebase/firestore";

export default function Word1() {
  const word_1 = ["昨日", "自転車"];

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const subcollectionRef = collection(db, '4Wwords', "1", 'episodes');
        const subcollectionSnapshot = await getDocs(subcollectionRef);
    
        // ドキュメントのデータを配列に変換
        const documents = subcollectionSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
    
        // 取得したドキュメントを返す
        console.log(documents);
      } catch (error) {
        console.error("Error fetching documents: ", error);
        throw error;
      }
    };
    
    fetchAllDocuments();
  }, []);

  return (
    <div>
      <h2>キーワードを選択してください:</h2>
      {word_1.map((keyword) => (
        <div key={keyword}>
          <Link href={`/${keyword}`}>
            <button>{keyword}</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
