import { createContext, useContext } from "react";



export const I18nContext = createContext();

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};

