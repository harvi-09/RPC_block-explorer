import React, { useEffect } from "react";
import DropFileInput from "./DropFileInput";
import HexInput from "./HexInput";
import "./HexPage.css";
import { useState } from "react";
import axios from "axios";
import Card from "./Card";
const { Buffer } = require("buffer");

const HexPage = () => {
  const [blockhex, setblockhex] = useState("");
  const [blockInfo, setblockInfo] = useState({});
  const [txData, settxData] = useState({});

  useEffect(() => {
    settxData({});
  
   
  }, [blockhex])
  

  const handleChange = (event) => {
    setblockhex(event.target.value);
  };

  const onFileChange = (files) => {
    console.log(files);
  };

  function hexToUint8Array(hexString) {
    const length = hexString.length / 2;
    const array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      array[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }

    return array;
  }

  function reverseBuffer(buff) {
    const reversed = Buffer.alloc(buff.length);
    for (let i = buff.length - 1; i >= 0; i--) {
      reversed[buff.length - i - 1] = buff[i];
    }
    return reversed.toString("hex");
  }

  const parseBlockHex = (blockHex) => {
    const blockStructure = JSON.parse(localStorage.getItem("Data"));

    if (!blockStructure) {
      console.error("Block structure not found in local storage.");
      return;
    }

    const buffer = hexToUint8Array(blockHex);

    let offset = 0;
    const parsedBlock = {};

    const fieldsToReverse = [
      "version",
      "hashPrevBlock",
      "hashMerkleRoot",
      "bits",
      "Nonce",
      "time",
      "newNonce",
      "height",
    ];

    const fieldstoDecimal = ["time", "newNonce", "height"];

    blockStructure.forEach((field) => {
      const fieldSize = parseInt(field.size, 10);

      if (!parsedBlock[field.name]) {
        parsedBlock[field.name] = {}; // Initialize the object if it doesn't exist
      }

      let fieldValue = Array.from(buffer.slice(offset, offset + fieldSize))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      parsedBlock[field.name]["orignal"] = fieldValue;

      parsedBlock[field.name]["reversed"] = reverseBuffer(
        Buffer.from(fieldValue, "hex")
      ).toString("hex");

      if (fieldsToReverse.includes(field.name)) {
        let temp = "";
        for (let i = fieldValue.length - 2; i >= 0; i -= 2) {
          temp += fieldValue[i] + fieldValue[i + 1];
        }
        fieldValue = temp;
      }

      offset += fieldSize; // Move to the next field
    });

    fieldstoDecimal.forEach((element) => {
      parsedBlock[element]["reversed"] = parseInt(
        parsedBlock[element]["reversed"],
        16
      );
    });

    const remainingHex = Array.from(buffer.slice(offset))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    parsedBlock["txHex"] = remainingHex;

    setblockInfo(parsedBlock);
  };

  const getTx = async (txHex) => {
    
    const txDataPayload = { txHex: txHex };
    try {
      const response = await axios.post(
        "http://localhost:3001/decoderawtransaction",
        {
          txDataPayload,
        }
      );
      console.log(response.data.txData);
      settxData(response.data.txData);
    } catch (error) {
      console.error("Error fetching block data:", error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    parseBlockHex(blockhex);
    setblockhex("");
  };
  
  return (
    <div className="box">
      <HexInput
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        blockhex={blockhex}
      />
      <DropFileInput onFileChange={(files) => onFileChange(files)} />

      {Object.entries(blockInfo).map(([key, value], index) => (
        <Card
          key={index}
          label={key}
          value={
            key === "txHex" ? (
              <a
                className="link"
                onClick={async () => {
                  await getTx(blockInfo.txHex);
                }}
              >
                {value}
              </a>
            ) : (
              value
            )
          }
        />
      ))}

{txData ? (
        <>
          {/* Display all data */}
          {Object.entries(txData).map(([key, value], index) => (
            <Card
              key={index}
              label={key}
              value={
                typeof value === "object" ? (
                  <div>
                    <pre>{JSON.stringify(value, null, 2)}</pre>{" "}
                  </div>
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
          Click on transaction Hex to get transaction Data
        </p>
      )}
     
    </div>
  );
};

export default HexPage;
