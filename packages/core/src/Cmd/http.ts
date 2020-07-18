import { Dispatch, Cmd } from "../types";

export function http<Data, Msg>(
  cons: (response: Data, error: Error) => Msg,
  input: RequestInfo,
  init?: RequestInit
): Cmd<Msg> {
  return async (dispatch: Dispatch<Msg>) => {
    try {
      const response = await fetch(input, init);
      const data: Data = await response.json();
      dispatch(cons(data, null));
    } catch (e) {
      dispatch(cons(null, e));
    }
  };
}
