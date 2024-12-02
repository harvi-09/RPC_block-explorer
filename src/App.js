import React from "react";
import { useState } from "react";
import axios from "axios";
import Card from "./components/Card";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import TransactionPage from "./components/TransactionPage";
import Input from "./components/Input";
import './style.css';


const App = () => {
  const [blockhash, setblockhash] = useState("");
  const [blockData, setBlockData] = useState(null);
  const [blockNum, setblockNum] = useState("")

  const handleChange = (event) => {
    setblockhash(event.target.value);
  };

  const callAPI = async (blockhash) => {

      const isBlockNumber = !isNaN(blockhash) && Number.isInteger(Number(blockhash));
      // const isBlockHash = typeof blockhash === "string" && /^[a-fA-F0-9]{64}$/.test(blockhash);


      let blockDataPayload;
      let blockHashPayload;

      if (isBlockNumber) {
        // -----------get-block-hash---------------
        blockHashPayload = { blocknumber: Number(blockhash)}; 
        try {
          const blockHash = await axios.post("http://localhost:3001/getblockhash", {
            blockHashPayload
          });
          setblockNum(blockHash.data.hash);
          blockhash = blockHash.data.hash;
        } catch (error) {
          console.error("Error fetching block data:", error.message);
        }
      }

      blockDataPayload = { blockhash: blockhash, verbosity: 2 }; // Adjust verbosity as needed
      try {
        const response = await axios.post("http://localhost:3001/getblock", {
          blockDataPayload
        });
        console.log("response.data.block ", response.data.block)
        setBlockData(response.data.block);
      } catch (error) {
        console.error("Error fetching block data:", error.message);
      }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await callAPI(blockhash);
    setblockhash("")
  };

  return (
    <>
     <h1  align="center">BLOCK DATA</h1>
     <div id="body">
        <Input handleSubmit={handleSubmit} blockhash={blockhash} handleChange={handleChange}/>           
            {blockData ? (
              <div>
                {/* <pre>{JSON.stringify(blockData, null, 2)}</pre> Display full data for debugging */}
                <Router>
                  <div style={{ padding: "20px" }}>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <>
                            {/* Display all data */}
                            {Object.entries(blockData).map(([key, value], index) => (
                              <Card
                                key={index}
                                label={key}
                                value={
                                  key === "tx" ? (
                                    value.map((tx, index) => (
                                      <div key={index}>
                                        <Link className="link" to={`/transaction/${blockData.hash}/${tx.txid}`}>
                                          {tx.txid}
                                        </Link>
                                      </div>
                                    ))
                                    
                                  ) : key === "cbTx" || typeof value === "object" ? (
                                    <div>
                                      <pre>{JSON.stringify(value, null, 2)}</pre>{" "}
                                    </div>
                                  ) : key === "previousblockhash" ? (
                                    <div>
                                      <p
                                        className="link"
                                        onClick={async () => {
                                          await callAPI(blockData.previousblockhash);
                                        }}
                                      >
                                        {blockData.previousblockhash}
                                      </p>
                                    </div>
                                  ) : key === "nextblockhash" ? (
                                    <p
                                      className="link"
                                      onClick={async () => {
                                        await callAPI(blockData.nextblockhash);
                                      }}
                                    >
                                      {blockData.nextblockhash}
                                    </p>
                                  ) : (
                                    value.toString()
                                  )
                                }
                              />
                            ))}
                          </>
                        }
                      />
                      {/* Dynamic route for transaction details */}
                      <Route
                        path="/transaction/:blockhash/:txId"
                        element={<TransactionPage />}
                      />
                    </Routes>
                  </div>
                </Router>
              </div>
            ) : (
              <p align="center">
                No data available. Enter a valid block hash and submit.
              </p>
            )}
     </div>
    </>
  );
};

export default App;
