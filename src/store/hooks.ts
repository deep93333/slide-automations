import { useContext, type Dispatch } from "react";

import { DispatchContext, StateContext } from "./context";
import type { AppAction, AppState } from "./reducer";

export function useAppState(): AppState {
  const state = useContext(StateContext);
  if (state === null) throw new Error("useAppState must be used inside <AppProvider>");
  return state;
}

export function useAppDispatch(): Dispatch<AppAction> {
  const dispatch = useContext(DispatchContext);
  if (dispatch === null) throw new Error("useAppDispatch must be used inside <AppProvider>");
  return dispatch;
}
