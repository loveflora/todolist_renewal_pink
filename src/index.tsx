import ReactDOM from "react-dom/client";
import App from "./App";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    padding: 0px;
    margin: 0px;
    box-sizing: border-box;
  }
  
  ul, li, ol {list-style: none}

  // html, body에 적용된거지,
  // Container 같은 컴포넌트에 적용된건 아님 !
html, body {
  width:100%;
  height:100%;
}
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <>
    <GlobalStyle />
    <App />
  </>,
);
