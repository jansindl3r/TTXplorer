import React from "react";
import BaseApp from "next/app";
import FelaProvider from "../FelaProvider";
import style from "@/style.scss";

class App extends BaseApp {
  render() {
    const { Component, pageProps, renderer } = this.props;

    return (
      <FelaProvider renderer={renderer}>
        <main>
          <Component {...pageProps} />
        </main>
      </FelaProvider>
    );
  }
}

export default App;
