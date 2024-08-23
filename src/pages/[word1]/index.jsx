import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function KeywordSelection() {
  const router = useRouter();
  const { word1 } = router.query;

  const keywords = ["明日", "車"];

  return (
    <div>
      <h1>{word1}のページです</h1>
      <h2>キーワードを選択してください:</h2>
      {keywords.map((keyword) => (
        <div key={keyword}>
          <Link href={`${word1}/${keyword}`}>
            <button>{keyword}</button>
          </Link>
        </div>
      ))}
      <Link href="/">
        <button>戻る</button>
      </Link>
    </div>
  );
}
