import { createContext } from "react";

export const AppContext = createContext({
  user: { isBlocked: false },
  userData: { handle: null, isAdmin: false },
  setAppState: () => {},
});
