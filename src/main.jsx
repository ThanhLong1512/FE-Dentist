import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import {
  DOMAIN_AUTH0,
  CLIENT_ID_AUTH0,
  REACT_GOOGLE_CLIENT_ID,
} from "./utils/constants.js";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={REACT_GOOGLE_CLIENT_ID}>
      <Auth0Provider
        domain={DOMAIN_AUTH0}
        clientId={CLIENT_ID_AUTH0}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <App />
      </Auth0Provider>
    </GoogleOAuthProvider>
  </Provider>
);
