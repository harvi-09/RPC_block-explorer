import React from "react";
import { Link } from "react-router-dom";
import "./header.css"

const Header = ({setBlockData}) => {
  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", backgroundColor: "#402a47"}}>
      <h1 align="center" onClick={() => setBlockData(null)}>
        BLOCK DATA
      </h1>
     {/* <div>
     <button style={{marginRight:"20px"}} type="submit">Block Details</button>
     <button style={{marginRight:"20px"}} type="submit">Block Hex Data</button>
     </div> */}
      <ul >
          <li><Link className="button" to="/">Home</Link></li>
          <li><Link className="button" to="/blockdetails">Get Block-Data</Link></li>
          <li><Link className="button" to="/hexData">Get Block-HexData</Link></li>
        </ul>
    </div>
  );
};

export default Header;
