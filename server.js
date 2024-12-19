const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const RpcClient = require("bitcoind-rpc");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const config = {
  protocol: "http",
  user: "rain",
  pass: "rain",
  host: "127.0.0.1",
  port: "12971",
};

RpcClient.config.logger = "normal";

const rpc = new RpcClient(config);

app.post("/getblockbynumber", (req, res) => {
  const { blockHashPayload } = req.body;
  console.log("blockHashPayload ", blockHashPayload);

  if (!Number.isInteger(blockHashPayload.blocknumber)) {
    return res.status(400).json({ error: "Invalid blockhash or verbosity" });
  }

  rpc.getblockhash(blockHashPayload.blocknumber, (err, result) => {
    if (err) {
      console.error("Error fetching block:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      rpc.getBlock(result.result, 1, (err, result) => {
        if (err) {
          console.error("Error fetching block:", err.message);
          res.status(500).json({ error: err.message });
        } else {
          res.json({ block: result.result });
        }
      });
    }
  });
});

app.post("/getdata", (req, res) => {
  const { blockDataPayload } = req.body;

  rpc.getBlock(
    blockDataPayload.blockhash,
    blockDataPayload.verbosity,
    (err, result) => {
      if (err) {
        console.error("Error getting block data:", err.message);

        rpc.getrawtransaction(
          blockDataPayload.blockhash,
          blockDataPayload.verbosity,
          (err, result) => {
            if (err) {
              console.error("Error getting transaction data:", err.message);
              return res
                .status(500)
                .json({ error: "Failed to fetch data: " + err.message });
            }
            res.json({ data: result });
          }
        );

        return;
      }

      res.json({ data: result });
    }
  );
});

app.post("/decoderawtransaction", (req, res) => {
  const { txDataPayload } = req.body;
  console.log("txDataPayload ", txDataPayload);

 
  rpc.decoderawtransaction(txDataPayload.txHex, (err, result) => {
     
     
        if (err) {
          console.error("Error fetching block:", err.message);
          res.status(500).json({ error: err.message });
        } else {
          res.json({ txData: result.result });
        }
      });
    
  });


app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
