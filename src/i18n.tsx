import { createContext, useContext, type ReactNode } from "react";

export type Language = "hi" | "en" | "gon";

const LanguageContext = createContext<Language>("hi");

export function LanguageProvider({ language, children }: { language: Language; children: ReactNode }) {
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
