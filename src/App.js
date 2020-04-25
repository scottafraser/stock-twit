import React from 'react';
import logo from './logo.svg';
import './App.css';
import List from "./components/List"
import NavBar from "./components/NavBar"

function App() {
  return (
    <div className="App">
      <NavBar>
        <List/>
      </NavBar>
    </div>
  );
}

export default App;
