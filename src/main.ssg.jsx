import React from "react";
import { ViteSSG } from "vite-ssg";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/storeconfiguration";
import routes from "./router"; // 👈 your react-router routes
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app }) => {
    app.use({
      install(app) {
        app._context.provides.store = store;
      },
    });
  }
);
