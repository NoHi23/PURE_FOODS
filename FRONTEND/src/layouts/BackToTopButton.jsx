import React, { useEffect, useState } from 'react';
import { FiChevronUp } from 'react-icons/fi';

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    showButton && (
      <button
        onClick={scrollToTop}
        className="back-to-top"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: 'green',
          color: '#fff',
          border: 'none',
          borderRadius: '20%',
          padding: '10px',
          cursor: 'pointer',
          zIndex: 9999,
        }}
        aria-label="Back to top"
      >
        <FiChevronUp size={30} />
      </button>
    )
  );
};

export default BackToTopButton;
