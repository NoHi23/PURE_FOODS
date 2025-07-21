import React, { createContext, useContext, useState } from "react";

const PriceFilterContext = createContext();

export const PriceFilterProvider = ({ children }) => {
  const [priceRange, setPriceRange] = useState([0, 250]);

  return (
    <PriceFilterContext.Provider value={{ priceRange, setPriceRange }}>
      {children}
    </PriceFilterContext.Provider>
  );
};

export const usePriceFilter = () => useContext(PriceFilterContext);