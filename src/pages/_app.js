import "@/styles/globals.css";
import { EpisodeProvider } from "../contexts/EpisodeContext";

export default function App({ Component, pageProps }) {
  return (
    <EpisodeProvider>
      <Component {...pageProps} />
    </EpisodeProvider>
  );
}
