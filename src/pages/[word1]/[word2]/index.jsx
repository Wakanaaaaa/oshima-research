import { useRouter } from "next/router";
import Link from "next/link";

export default function RelatedKeywords() {
  const router = useRouter();
  const { word1, word2 } = router.query;

  const keywordAssociations = {
    明日: ["餃子", "祭り", "サークル"],
    車: ["駐車場"],
  };

  const associatedKeywords = keywordAssociations[word2] || [];

  return (
    <div>
      <h1>
        {word1}---{word2}のページです
      </h1>
      <h2>{word2}に関連したキーワード:</h2>
      {/* {associatedKeywords.map((relatedKeyword) => (
        <div key={relatedKeyword}>{relatedKeyword}</div>
      ))} */}

<h2>キーワードを選択してください:</h2>
      {associatedKeywords.map((keyword) => (
        <div key={keyword}>
          <Link href={`/${word1}/${word2}/${keyword}`}>
            <button>{keyword}</button>
          </Link>
        </div>
      ))}

      <Link href={`/${word1}`}>
        <button>戻る</button>
      </Link>
    </div>
  );
}
