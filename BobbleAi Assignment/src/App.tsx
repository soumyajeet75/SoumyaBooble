import React from "react";
import "./App.scss";
import { Header } from "./modules/nav/Header";
import { AuthScreen } from "./auth/AuthScreen";

/**
 ** Header is static
 ** All the auth logic will taken cared by AuthScreen Component
 */

function App() {
  return (
    <div className="App">
      <Header />
      <AuthScreen />
    </div>
  );
}

export default App;
