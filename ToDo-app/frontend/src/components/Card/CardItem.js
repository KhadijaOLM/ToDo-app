import React from 'react';
import './CardItem.css';

const CardItem = ({ card }) => {
  return (
    <div className="card-item">
      <h4>{card.title}</h4>
      <p>{card.description}</p>
    </div>
  );
};

export default CardItem;