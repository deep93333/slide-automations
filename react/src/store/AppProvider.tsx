import { useEffect, useReducer, type ReactNode } from "react";

import { config } from "@/config";

import { DispatchContext, StateContext } from "./context";
import { createInitialState, reducer } from "./reducer";

interface AppProviderProps {
  children: ReactNode;
  emptyState?: boolean;
}

export function AppProvider({ children, emptyState = false }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, { emptyState }, createInitialState);

  // A toast dismisses itself. Keyed by id, so a newer toast is not taken down
  // by the timer of the one it replaced.
  const toastId = state.toast?.id;
  useEffect(() => {
    if (toastId === undefined) return;
    const timer = setTimeout(() => dispatch({ type: "toast/dismiss", id: toastId }), config.toastDurationMs);
    return () => clearTimeout(timer);
  }, [toastId]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}
