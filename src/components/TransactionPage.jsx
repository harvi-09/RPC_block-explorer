import React, { useState ,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TransactionPage = () => {
  const { blockhash, txId } = useParams();  
  const [txData, setTxData] = useState(null);

  


  const handleTransaction = async (event) => {
    try { 
      const response = await axios.post("http://localhost:3001/getrawtransaction", { txId, blockhash }); 
      setTxData(response.data.block);  
    } catch (error) {
      console.error("Error fetching transaction data:", error.message);
    } 
  };

  useEffect(() => {
    handleTransaction()
  
   
  }, [TransactionPage])
  

  return (
    <div style={{ padding: '20px' }}>
      <h2>Transaction Details</h2>
      <p>Transaction ID: <strong>{txId}</strong></p>
      <p>Blockhash: <strong>{blockhash}</strong></p>

  
      {/* <button onClick={handleTransaction}>Get Transaction</button> */}

    
     
      {txData && (
        <div>
          <h3>Transaction Data:</h3>
          <pre>{JSON.stringify(txData, null, 2)}</pre> {/* Pretty print the transaction data */}
        </div>
      )}

     
    </div>
  );
};

export default TransactionPage;

