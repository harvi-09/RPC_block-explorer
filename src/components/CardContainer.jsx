import React from "react";
import Input from "./Input";
import Card from "./Card";
import { useState } from "react";
import axios from "axios";

const CardContainer = ({}) => {
  const [blockhash, setblockhash] = useState("");
  const [blockData, setBlockData] = useState(null);

  const handleChange = (event) => {
    console.log("event.target.value ", event.target.value);
    setblockhash(event.target.value);
  };

  const callAPI = async (blockhash) => {

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
     <Input
          handleSubmit={handleSubmit} handleChange={handleChange} blockhash={blockhash}
        />
      {blockData ? (
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
                      <a className="link" onClick={() => callAPI(tx)}>
                        {tx}
                      </a>
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
                ) : key === "blockhash" ? (
                  <p
                    className="link"
                    onClick={async () => {
                      await callAPI(blockData.blockhash);
                    }}
                  >
                    {blockData.blockhash}
                  </p>
                ) 
                : (
                  value.toString()
                )
              }
            />
          ))}
        </>
      ) : (
        <p align="center">
          No data available. Enter a valid block hash and submit.
        </p>
      )}
    </>
  );
};

export default CardContainer;
