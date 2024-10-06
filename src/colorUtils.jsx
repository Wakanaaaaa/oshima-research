import { useEffect } from "react";

// ランダムな色を生成する関数
export const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export function useBackgroundColor() {
  useEffect(() => {
    // ランダムな色を生成し、透明度を25%にして背景色を設定
    const randomColor = generateRandomColor(); // ランダムな色を生成
    const rgbaColor = convertToRGBA(randomColor, 0.25); // RGBA形式に変換
    document.body.style.backgroundColor = rgbaColor; // 背景色を設定

    // クリーンアップ: コンポーネントがアンマウントされる際に背景色をリセット
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);
}

// RGB形式の色コードをRGBAに変換し、透明度を設定する関数
function convertToRGBA(color, opacity = 0.25) {
  // #RRGGBB形式の色コードから、R, G, Bを抽出
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // RGBA形式に変換して返す
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

