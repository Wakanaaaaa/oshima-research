"use client";
import { createContext, useContext, useState, useEffect } from "react";

const EpisodeContext = createContext();

export function EpisodeProvider({ children }) {
  const [episodeType, setEpisodeType] = useState(() => {
    // 初期値をlocalStorageから取得
    if (typeof window !== "undefined") {
      return localStorage.getItem("episodeType") || null;
    }
    return null;
  });

  useEffect(() => {
    // 状態が変わるたびにlocalStorageに保存
    if (episodeType !== null) {
      localStorage.setItem("episodeType", episodeType);
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
