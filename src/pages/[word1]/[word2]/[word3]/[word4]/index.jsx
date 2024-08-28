import { useRouter } from "next/router";
import Link from "next/link";

export default function RelatedKeywords() {
  const router = useRouter();
  const { word1, word2, word3, word4 } = router.query;

  const keywordAssociations = {
    チャーハン: [" "],
  };

  const associatedKeywords = keywordAssociations[word4] || [];

  return (
    <div>
      <h1>
        {word1}---{word2}---{word3}---{word4}のページです
      </h1>
      <h2>{word4}に関連したキーワード:</h2>
      {associatedKeywords.map((relatedKeyword) => (
        <div key={relatedKeyword}>{relatedKeyword}</div>
      ))}
      <Link href={`/${word3}`}>
        <button>戻る</button>
      </Link>
    </div>
  );
}
