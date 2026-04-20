import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRate, interactive = false, size = 20, className = "" }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (val) => {
    if (interactive) {
      setHoverRating(val);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const handleClick = (val) => {
    if (interactive && onRate) {
      onRate(val);
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((val) => (
        <Star
          key={val}
          size={size}
          className={`${interactive ? 'cursor-pointer transform hover:scale-125 transition-transform' : ''} ${
            (hoverRating || rating) >= val
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 fill-transparent'
          }`}
          onMouseEnter={() => handleMouseEnter(val)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(val)}
        />
      ))}
    </div>
  );
};

export default StarRating;
