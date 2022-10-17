import Head from "next/head";
import { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.css";
import "../styles/bootstrap.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <>
      <Head>
        <title>Kelli Poker</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
