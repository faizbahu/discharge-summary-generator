import * as React from "react";

import Login from "@/app/Login/page";
import Head from "next/head";
export default function Home() {
  return (
    <>
   
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Login />
     
    </>
  );
}
