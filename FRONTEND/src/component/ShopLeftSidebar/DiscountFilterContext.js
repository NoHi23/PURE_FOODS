import React, { createContext, useContext, useState } from "react";

const DiscountFilterContext = createContext();

export const DiscountFilterProvider = ({ children }) => {
  const [discountRange, setDiscountRange] = useState([0, 100]);

  return (
    <DiscountFilterContext.Provider value={{ discountRange, setDiscountRange }}>
      {children}
    </DiscountFilterContext.Provider>
  );
};

export const useDiscountFilter = () => useContext(DiscountFilterContext);