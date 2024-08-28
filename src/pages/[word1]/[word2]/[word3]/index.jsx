import { useRouter } from "next/router";
import Link from "next/link";

export default function RelatedKeywords() {
  const router = useRouter();
  const { word1, word2, word3 } = router.query;

  const keywordAssociations = {
    餃子: ["油", "チャーハン"],
    駐車場: ["料金"],
  };

  const associatedKeywords = keywordAssociations[word3] || [];

  return (
    <div>
      <h1>
        {word1}---{word2}---{word3}のページです
      </h1>
      <h2>{word3}に関連したキーワード:</h2>
      {associatedKeywords.map((keyword) => (
        <div key={keyword}>
          <Link href={`/${word1}/${word2}/${word3}/${keyword}`}>
            <button>{keyword}</button>
          </Link>
        </div>
      ))}
      <Link href={`/${word2}`}>
        <button>戻る</button>
      </Link>
    </div>
  );
}
