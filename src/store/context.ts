import { createContext, type Dispatch } from "react";

import type { AppAction, AppState } from "./reducer";

// Two contexts, so a component that only dispatches does not re-render on
// every state change.
export const StateContext = createContext<AppState | null>(null);
export const DispatchContext = createContext<Dispatch<AppAction> | null>(null);
