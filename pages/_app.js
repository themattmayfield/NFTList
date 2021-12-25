import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_APP_ID}
      serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}
    >
      <ThemeProvider enableSystem attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </MoralisProvider>
  );
}

export default MyApp;
