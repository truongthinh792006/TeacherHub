import { createContext, useContext } from 'react';
import { AppContextType } from '../types';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = AppContext.Provider;

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
