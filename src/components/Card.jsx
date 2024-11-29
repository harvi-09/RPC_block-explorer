import React from 'react';

const Card = ({ label, value }) => {
  return (
    <div style={cardStyle}>
      <span style={labelStyle}>{label}:</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
};

// Inline Styles
const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  maxWidth: '60%',
  margin: '10px auto',
  textAlign: 'left',
  fontFamily: 'Arial, sans-serif',
  wordBreak: 'break-word', 
};

const labelStyle = {
  fontWeight: 'bold',
  marginRight: '8px',
};

const valueStyle = {
  color: '#333',
};

export default Card;
