import Link from "next/link";

export default function Word1() {
  const word_1 = ["昨日", "自転車"];

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
