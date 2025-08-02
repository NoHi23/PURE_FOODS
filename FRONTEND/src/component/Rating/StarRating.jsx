import React from "react";
import PropTypes from "prop-types";
import "./StarRating.css";

const StarRating = ({ rating }) => {
  const hasReviews = rating > 0; // Giả sử rating > 0 nghĩa là có đánh giá; nếu rating = 0 thì coi như chưa có đánh giá nào
  const colorClass = hasReviews ? "text-warning" : "text-muted"; // text-muted thường là xám trong Bootstrap; bạn có thể điều chỉnh nếu dùng framework khác

  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  const stars = [];
  for (let i = 0; i < full; i++) {
    stars.push(<i key={`full-${i}`} className={`fas fa-star ${colorClass}`} />);
  }
  if (half) {
    stars.push(<i key="half" className={`fas fa-star-half-alt ${colorClass}`} />);
  }
  for (let i = 0; i < empty; i++) {
    stars.push(<i key={`empty-${i}`} className={`far fa-star ${colorClass}`} />);
  }

  return <div className="star-rating">{stars}</div>;
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;