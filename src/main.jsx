import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./store/storeconfiguration";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        pauseOnHover
        theme="colored"
      />
      <App />
    </BrowserRouter>
  </Provider>
);
