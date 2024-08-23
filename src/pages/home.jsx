import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const keywords = ["昨日", "自転車"];
  const relatedKeywords = {
    昨日: ["餃子", "祭り"],
    自転車: ["チェーン", "サビ"],
  };
  
  const deeperKeywords = {
    餃子: ["皮", "具", "油"],
    祭り: ["出店", "音楽"],
    チェーン: ["油", "調整"],
    サビ: ["クリーナー", "塗料"],
  };

  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [selectedSubKeyword, setSelectedSubKeyword] = useState(null);

  const handleKeywordClick = (keyword) => {
    setSelectedKeyword(keyword);
    setSelectedSubKeyword(null);
  };

  const handleSubKeywordClick = (subKeyword) => {
    setSelectedSubKeyword(subKeyword);
  };

  return (
    <div className={styles.container}>
      {!selectedKeyword ? (
        <div>
          <h2>キーワードを選択してください:</h2>
          <div className={styles.buttonContainer}>
            {keywords.map((keyword) => (
              <button key={keyword} onClick={() => handleKeywordClick(keyword)}>
                {keyword}
              </button>
            ))}
          </div>
        </div>
      ) : !selectedSubKeyword ? (
        <div>
          <h2>{selectedKeyword}に関連したキーワード:</h2>
          <div className={styles.buttonContainer}>
            {relatedKeywords[selectedKeyword].map((relatedKeyword) => (
              <button key={relatedKeyword} onClick={() => handleSubKeywordClick(relatedKeyword)}>
                {relatedKeyword}
              </button>
            ))}
          </div>
          <button onClick={() => setSelectedKeyword(null)}>戻る</button>
        </div>
      ) : (
        <div>
          <h2>{selectedKeyword} - {selectedSubKeyword}に関連したキーワード:</h2>
          <div className={styles.buttonContainer}>
            {deeperKeywords[selectedSubKeyword]?.map((deepKeyword) => (
              <div key={deepKeyword}>{deepKeyword}</div>
            ))}
          </div>
          <button onClick={() => setSelectedSubKeyword(null)}>戻る</button>
        </div>
      )}
    </div>
  );
}
