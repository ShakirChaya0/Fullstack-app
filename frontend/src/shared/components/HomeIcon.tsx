import React from 'react';
import restaurantImage from './restaurante.png';

const RestaurantIcon = ({ width = 40, height = 40, alt = 'Restaurant Icon' }) => {
  return (
    <img
      src={restaurantImage}
      alt={alt}
      width={width}
      height={height}
      style={{ display: 'inline-block' }}
    />
  );
};

export default RestaurantIcon;
