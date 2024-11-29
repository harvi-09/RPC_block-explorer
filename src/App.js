import React from "react";
import { useState } from "react";
import axios from "axios";
import Card from "./components/Card";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import TransactionPage from "./components/TransactionPage";

const App = () => {
  const [blockhash, setblockhash] = useState("");
  const [verbosity, setverbosity] = useState(1);
  const [blockData, setBlockData] = useState(null);

  const handleChange = (event) => {
    setblockhash(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/getblock", {
        blockhash,
        verbosity,
      });
      setBlockData(response.data.block);
    } catch (error) {
      console.error("Error fetching block data:", error.message);
    }
  };
  console.log(blockData);
  return (
    <>
      <h1 align="center">BLOCK DATA</h1>
      <form align="center" onSubmit={handleSubmit}>
        <label htmlFor="textInput">Enter Block hash:</label>
        <input
          id="textInput"
          type="text"
          value={blockhash}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>

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
                              value.map((txId, idx) => (
                                <div key={idx}>
                                  <Link
                                    to={`/transaction/${blockhash}/${txId}`}
                                  >
                                    {txId}
                                  </Link>
                                </div>
                              ))
                            ) : key === "cbTx" ? (
                              
                              <div>
                                <pre>{JSON.stringify(value, null, 2)}</pre>{" "}
                              </div>
                            ): key === "previousblockhash" ? (
                              
                              <div>
                                
                                <p onClick={handleSubmit}>{blockData.previousblockhash}</p>
                              </div>
                            )  : key === "nextblockhash" ? (
                              
                              <div>
                                
                                <p>{blockData.nextblockhash}</p>
                              </div>
                            )  
                            
                            : (
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
    </>
  );
};

export default App;
