"use client"
import { createContext, useState, useContext } from 'react';

const SummaryContext = createContext();

export const SummaryProvider = ({ children }) => {
  const [summary, setSummary] = useState('');
  const updateSummary = (newSummary) => {
    // console.log('Setting summary:', newSummary); // Log the new summary
    setSummary(newSummary);
};

  return (
    <SummaryContext.Provider value={{ summary, setSummary: updateSummary }}>
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummary = () => useContext(SummaryContext);
