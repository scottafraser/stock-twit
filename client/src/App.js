import React from "react";
import Intro from "./components/Intro";
import "./App.css";
import List from "./components/List";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <NavBar>
        <Intro />
        <List />
        <Footer />
      </NavBar>
    </div>
  );
}

export default App;
