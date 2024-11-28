"use client";
import { createContext, useContext, useState, useEffect } from "react";

const EpisodeContext = createContext();

export function EpisodeProvider({ children }) {
  const [episodeType, setEpisodeType] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("episodeType"); // ローカルストレージに保存された値を取得
    }
    return null; // 初期値を設定しない
  });
  
  useEffect(() => {
    if (episodeType !== null) {
      localStorage.setItem("episodeType", episodeType); // 値が選択されたときだけ保存
    }
  }, [episodeType]);
  

  return (
    <EpisodeContext.Provider value={{ episodeType, setEpisodeType }}>
      {children}
    </EpisodeContext.Provider>
  );
}

// カスタムフック
export function useEpisode() {
  const context = useContext(EpisodeContext);
  if (!context) {
    throw new Error("useEpisode must be used within an EpisodeProvider");
  }
  return context;
}
