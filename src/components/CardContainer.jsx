import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Card from "./Card";

const CardContainer = ({ blockData, callAPI }) => {
  return (
    <>
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
