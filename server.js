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

RpcClient.config.logger = 'normal';

const rpc = new RpcClient(config);


app.post("/getblock", (req, res) => {
    const { blockhash , verbosity} = req.body;

    if (!blockhash || typeof verbosity !== "number") {
        return res.status(400).json({ error: "Invalid blockhash or verbosity" });
    }

    rpc.getBlock(blockhash, verbosity,(err, result) => {
      if (err) {
        console.error("Error fetching block:", err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json({ block: result.result }); 
      }
    });
  });
  
  app.post("/getrawtransaction", (req, res) => {
    const { txId, blockhash } = req.body;
 
   
    rpc.getrawtransaction(txId, blockhash, (err, result) => {
      if (err) {
        console.error("Error fetching transaction:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({ block: result.result, blockhash: blockhash });
    });
  });
  

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});