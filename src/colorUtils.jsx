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

// export  const hexToRgba = (hex, alpha) => {
//     let r = 0,
//       g = 0,
//       b = 0;
//     if (hex.length === 4) {
//       r = parseInt(hex[1] + hex[1], 16);
//       g = parseInt(hex[2] + hex[2], 16);
//       b = parseInt(hex[3] + hex[3], 16);
//     } else if (hex.length === 7) {
//       r = parseInt(hex[1] + hex[2], 16);
//       g = parseInt(hex[3] + hex[4], 16);
//       b = parseInt(hex[5] + hex[6], 16);
//     }
//     return `rgba(${r},${g},${b},${alpha})`;
//   };


  export function useBackgroundColor() {
    useEffect(() => {
      // URLのクエリパラメータから色を取得
      const urlParams = new URLSearchParams(window.location.search);
      const color = urlParams.get("color");
  
      // 背景色を設定 (透明度を25%に)
      if (color) {
        const rgbaColor = convertToRGBA(color, 0.25);
        document.body.style.backgroundColor = rgbaColor;
      }
  
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
  
