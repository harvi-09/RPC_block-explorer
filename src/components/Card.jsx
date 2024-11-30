import React from 'react';
import './card.css'

const Card = ({ label, value }) => {
  return (
    <div id="cardStyle">
      <span id="lablestyle">{label}:</span>
      <span id="valueStyle">{value}</span>
    </div>
  );
};

// Inline Styles

export default Card;
