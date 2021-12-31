import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_APP_ID}
      serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}
    >
      <ThemeProvider enableSystem attribute="class">
        <Component {...pageProps} />
        <ToastContainer />
      </ThemeProvider>
    </MoralisProvider>
  );
}

export default MyApp;
