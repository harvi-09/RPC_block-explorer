import React from "react";
import { useState } from "react";
import axios from "axios";
import Input from "./components/Input";
import "./style.css";
import CardContainer from "./components/CardContainer";

const App = () => {
  const [blockhash, setblockhash] = useState("");
  const [blockData, setBlockData] = useState(null);

  const handleChange = (event) => {
    console.log("event.target.value ", event.target.value);
    setblockhash(event.target.value);
  };

  const callAPI = async (blockhash) => {
    // if (blockhash === null || blockhash === undefined) {
    //   return;
    // }

    const isBlockNumber =
      !isNaN(blockhash) && Number.isInteger(Number(blockhash));

    if (isBlockNumber) {
      // -----------get-block-hash---------------
      const blockHashPayload = { blocknumber: Number(blockhash) };
      try {
        const response = await axios.post(
          "http://localhost:3001/getblockbynumber",
          {
            blockHashPayload,
          }
        );
        console.log("response.result ", response.data.block);
        setBlockData(response.data.block);
      } catch (error) {
        console.error("Error fetching block data:", error.message);
      }
      return;
    }

    const blockDataPayload = { blockhash: blockhash, verbosity: 1 }; // Adjust verbosity as needed
    try {
      console.log("blockDataPayload :", blockDataPayload);
      const response = await axios.post("http://localhost:3001/getdata", {
        blockDataPayload,
      });
      setBlockData(response.data.data.result);
    } catch (error) {
      console.error("Error fetching block data:", error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await callAPI(blockhash);
    setblockhash("");
  };

  return (
    <>
      <h1 align="center" onClick={() => setBlockData(null)}>
        BLOCK DATA
      </h1>
      <div id="body">
        <Input
          handleSubmit={handleSubmit}
          blockhash={blockhash}
          handleChange={handleChange}
        />
        <CardContainer blockData={blockData} callAPI={callAPI} />
      </div>
    </>
  );
};

export default App;
