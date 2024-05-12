import { createContext } from "react";

export const AppContext = createContext({
  user: {},
  userData: { handle: null, isAdmin: false, isBlocked: false },
  setAppState: () => {},
});
