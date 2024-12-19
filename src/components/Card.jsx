import React from "react";
import "./card.css";

const Card = ({ label, value }) => {
  return (
    <div id="cardStyle">
      <span id="lablestyle">{label}:</span>
      <span id="valueStyle">
        {label == "extraData"
          ? value
          : value["orignal"] === undefined
          ? value
          : value["orignal"]}
      </span>

      <br />
      <span id="valueStyle">{value["reversed"]}</span>
    </div>
  );
};

// Inline Styles

export default Card;
