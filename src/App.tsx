import React, { FC } from 'react';
import './App.css';
import Header from "./Components/Header";
import Card from "./Components/Card";


const App :FC = () => {

  return (
    <div className="App">
        <Header/>
        <Card/>
    </div>
  );
}

export default App;
