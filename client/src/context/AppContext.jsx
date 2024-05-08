import { createContext } from "react";

export const AppContext = createContext({
  user: { isAdmin: false },
  userData: { handle: null },
  setAppState: () => {},
});
