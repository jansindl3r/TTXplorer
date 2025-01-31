/* eslint-disable */
import { Component } from "react";
import { RendererProvider, ThemeProvider } from "react-fela";
import getFelaRenderer from "./getFelaRenderer";

const fallbackRenderer = getFelaRenderer();

export default class FelaProvider extends Component {
  render() {
    const renderer = this.props.renderer || fallbackRenderer;
    return (
      <RendererProvider renderer={renderer}>
        <ThemeProvider
          theme={{
            borderRadius: 5,
            background: "#F2F2F2",
            buttonPadding: {
              paddingVertical: 8,
              paddingHorizontal: 12,
            },
          }}
        >
          {this.props.children}
        </ThemeProvider>
      </RendererProvider>
    );
  }
}
