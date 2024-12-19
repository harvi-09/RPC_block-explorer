import React from "react";
import { useState } from "react";
import axios from "axios";
import Input from "./components/Input";
import "./style.css";
import Header from "./components/Header";
import CardContainer from "./components/CardContainer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HexPage from "./components/HexPage";

const App = () => {
 
  const [blockData, setBlockData] = useState(null);

 

  

 

  return (
    <>
     <BrowserRouter>
     <Header setBlockData={setBlockData}/>
      <div id="body">
       
       
      </div>


      <Routes>
        <Route path="/blockdetails" Component={CardContainer} />
        <Route path="/hexData" Component={HexPage} />
      </Routes>
     </BrowserRouter>
    </>
  );
};

export default App;
