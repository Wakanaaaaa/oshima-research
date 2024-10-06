import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import styles from "../styles/word.module.css";
import { fetchFirestoreData, shuffleArray } from "../firestoreUtils.jsx";
import { generateRandomColor } from "../colorUtils.jsx";
import { useRouter } from 'next/router';

export default function Word1() {
  const [keywords, setKeywords] = useState([]); // 空の配列を用意(ステート管理)
  const [colors, setColors] = useState([]); //枠のカラー

  const router = useRouter();
  const targetRef = useRef(null);
  let initialDistance = 0;

  const getDistance = (touches) => {
    const [touch1, touch2] = touches;
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const allFieldsArray = await fetchFirestoreData();
        const shuffledArray = shuffleArray(allFieldsArray);
        const randomFields = shuffledArray.slice(0, 6);
        // ステートを更新
        setKeywords(randomFields);

        const randomColors = randomFields.map(() => generateRandomColor());
        setColors(randomColors);
      } catch (error) {
        console.error("Error fetching subcollection documents: ", error);
      }
    };

    fetchAllDocuments();
  }, []);


  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        const currentDistance = getDistance(e.touches);
        const zoomFactor = currentDistance / initialDistance;

        // ズームインの判定
        if (zoomFactor > 1.5) { // ズームがほぼいっぱいになった場合
          // 現在の画面の幅を取得
          const viewportWidth = window.innerWidth;

          // 対象要素の座標を取得
          const rect = targetRef.current.getBoundingClientRect();
          const coordinates = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          };

          console.log('Viewport Width:', viewportWidth);
          console.log('Element Coordinates:', coordinates);

          // ページ遷移
          router.push('/hoge/hoge'); // 遷移先のページに変更
        } else {
          // ズーム効果を適用
          targetRef.current.style.transform = `scale(${zoomFactor})`;
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [router]);

  return (
    <div>
      <ul>
        {keywords.map((item, index) => (
          <ol key={index}>
            <Link
              href={{
                pathname: `/${item.episodeID}/${item.value}`,
                query: { color: colors[index] },
              }}
            >
              <button
                className={styles.button}
                style={{ borderColor: colors[index] }}
              >
                {item.value}
              </button>
            </Link>
          </ol>
        ))}
      </ul>
      <div
      ref={targetRef}
      style={{
        transition: 'transform 0.3s ease',
        touchAction: 'none',
        width: '100%',
        height: '100%',
        backgroundColor: 'lightblue',
      }}
    >
      あなたのコンテンツ
    </div>
    </div>
  );
}
