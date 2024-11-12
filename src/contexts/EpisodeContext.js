// contexts/EpisodeContext.js
"use client";
import { createContext, useContext, useState } from "react";

const EpisodeContext = createContext();

export function EpisodeProvider({ children }) {
  const [episodeType, setEpisodeType] = useState("episodeA");

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
