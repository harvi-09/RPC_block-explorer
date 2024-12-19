import React from "react";


const Input = ({ handleSubmit, handleChange, blockhex}) => {

    
  return (
    <div style={{marginBottom:"50px",}}>
      <form align="center" onSubmit={handleSubmit} style={{margin:"0 auto"}} >
        <input
        style={{width:"800px"}}
          id="textInput"
          type="text"
          value={blockhex}
          onChange={handleChange}
          placeholder="enter blockhex"
        />
        <button type="submit">Submit</button>

        
       
      </form>
    </div>
  );
};

export default Input;
