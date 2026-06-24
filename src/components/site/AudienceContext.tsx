import { createContext, useContext, useState, type ReactNode } from "react";

export type Audience = "lojistas" | "prestadores";

type AudienceContextValue = {
  audience: Audience;
  setAudience: (a: Audience) => void;
};

const AudienceContext = createContext<AudienceContextValue | undefined>(undefined);

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudience] = useState<Audience>("lojistas");
  return (
    <AudienceContext.Provider value={{ audience, setAudience }}>
      {children}
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  const ctx = useContext(AudienceContext);
  if (!ctx) throw new Error("useAudience must be used within AudienceProvider");
  return ctx;
}
