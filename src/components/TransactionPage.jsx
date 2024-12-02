import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "./Card";
import { Link } from "react-router-dom";

const TransactionPage = () => {
  const { blockhash, txId } = useParams();
  const [txData, setTxData] = useState(null);

  const handleTransaction = async (event) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/getrawtransaction",
        { txId, blockhash }
      );
      setTxData(response.data.block);
    } catch (error) {
      console.error("Error fetching transaction data:", error.message);
    }
  };

  useEffect(() => {
    handleTransaction();
  }, []);

  // console.log(response.data.block)
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2 style={{ color: "white" }}>Transaction Details</h2>

      {txData && (
        <div style={{ padding: "20px", maxWidth: "80vw" }}>
          {console.log(txData)}
          {Object.entries(txData).map(([key, value], index) => (
            <Card
              key={index}
              label={key}
              value={
                key === "cbTx" || typeof value === "object" ? (
                  <div>
                    <pre>{JSON.stringify(value, null, 2)}</pre>{" "}
                  </div>
                ) : (
                  value.toString()
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
