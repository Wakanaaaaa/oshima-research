import { useState, useRef } from "react";
import styles from "@/styles/word.module.css";

export default function ShuffleOnPull({ children, onShuffle }) {
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartRef = useRef(0);

  // 最大引っ張り距離を設定
  const MAX_PULL_DISTANCE = 200;

  // タッチ開始時の位置を記録
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  // タッチ中に引っ張られた距離を計算
  const handleTouchMove = (e) => {
    const touchMove = e.touches[0].clientY;
    const distance = touchMove - touchStartRef.current;
    if (distance > 0) {
      setPullDistance(Math.min(distance, MAX_PULL_DISTANCE));
    }
  };

  // タッチ終了時に引っ張りの距離が一定以上ならシャッフルを実行
  const handleTouchEnd = () => {
    if (pullDistance > 100) {
      onShuffle();
    }
    setPullDistance(0);
  };

  return (
    <div
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${pullDistance}px)`,
        transition: pullDistance > 0 ? "transform 0s" : "transform 0.3s",
      }}
    >
      {children}
    </div>
  );
}
