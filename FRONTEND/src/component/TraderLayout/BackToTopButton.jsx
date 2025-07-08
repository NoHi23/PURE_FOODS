import React, { useEffect, useState } from 'react';
import { FiChevronUp } from 'react-icons/fi';
import './BackToTopButton.css';

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`mint-capsule-button ${showButton ? 'show' : ''}`}
      aria-label="Back to top"
    >
      <FiChevronUp size={18} />
    </button>
  );
};

export default BackToTopButton;
