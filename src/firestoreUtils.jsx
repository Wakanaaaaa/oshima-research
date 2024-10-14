import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";

// Firestoreからデータを取得する共通関数
export const fetchFirestoreData = async (testerNumber) => {
  const subcollectionRef = collection(db, "4Wwords", testerNumber, "episodes");
  const subcollectionSnapshot = await getDocs(subcollectionRef);
  const allFieldsArray = [];
  subcollectionSnapshot.forEach((doc) => {
    const data = doc.data();
    const docID = doc.id;
    for (const [key, value] of Object.entries(data)) {
      allFieldsArray.push({ key, value, episodeID: docID });
    }
  });

  return allFieldsArray;
};

// 配列をシャッフルする共通関数
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
