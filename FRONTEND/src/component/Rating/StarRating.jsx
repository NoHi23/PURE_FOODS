import React from "react";
import PropTypes from "prop-types";
import "./StarRating.css";

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  const stars = [];
  for (let i = 0; i < full; i++) {
    stars.push(<i key={`full-${i}`} className="fas fa-star text-warning" />);
  }
  if (half) {
    stars.push(<i key="half" className="fas fa-star-half-alt text-warning" />);
  }
  for (let i = 0; i < empty; i++) {
    stars.push(<i key={`empty-${i}`} className="far fa-star text-warning" />);
  }

  return <div>{stars}</div>;
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
