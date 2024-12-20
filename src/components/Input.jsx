import React from "react";
import "./input.css";

const Input = ({ handleSubmit, handleChange, blockhash}) => {
  return (
    <div style={{marginBottom:"50px", display:"flex", justifyContent:"center"}}>
      <form align="center" onSubmit={handleSubmit}>
        <input
          id="textInput"
          type="text"
          value={blockhash}
          onChange={handleChange}
          placeholder="enter blockhash or block number"
        />
        <button type="submit">Submit</button>

        
       
      </form>
    </div>
  );
};

export default Input;
