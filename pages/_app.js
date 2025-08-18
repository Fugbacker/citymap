import "../styles/globals.css";
import "../styles/mediascreen.css";
import Script from "next/script";
import https from "https";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import { FakeOrders } from "@/Components/fakeOrders";
import Snowfall from "react-snowfall";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const router = useRouter();

  const showNotification = () => {
    setIsNotificationVisible(true);
  };

  const hideNotification = () => {
    setIsNotificationVisible(false);
  };
 const timeOut = Math.floor(Math.random() * 20000) + 15000
  useEffect(() => {
    if (router.pathname !== "/" && router.pathname !== "/pkk") {
      const interval = setInterval(() => {
        showNotification();
        setTimeout(() => {
          hideNotification();
        }, timeOut);
      }, Math.floor(Math.random() * 20000) + 15000);

      return () => clearInterval(interval);
    }
  }, [router.pathname]);

  axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  useEffect(() => {
    // Обновляем ширину экрана при загрузке компонента
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);

    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  return (
    <SessionProvider>
      <Script id="my-script">
        {`new Image().src = "https://counter.yadro.ru/hit?r"+
          escape(document.referrer)+((typeof(screen)=="undefined")?"":
          ";s"+screen.width+"*"+screen.height+"*"+(screen.colorDepth?
          screen.colorDepth:screen.pixelDepth))+";u"+escape(document.URL)+
          ";h"+escape(document.title.substring(0,150))+
          ";"+Math.random();
        `}
      </Script>
      {/* <Snowfall /> */}
      <NextNProgress
        options={{ showSpinner: false }}
        color="#48a728"
        startPosition={0.3}
        stopDelayMs={200}
        height={6}
        showOnShallow={true}
      />

      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        // limit={3}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
      {isNotificationVisible && screenWidth >= 750 && <FakeOrders />}
      <Component key={router.asPath} {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
