import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { initializeContract } from "./utils/near";

initializeContract()
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <ChakraProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ChakraProvider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  })
  .catch((err) => {
    console.error(err);
  });