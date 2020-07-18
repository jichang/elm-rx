import { Dispatch, Cmd } from "../types";

export function random<Msg>(cons: (num: number) => Msg): Cmd<Msg> {
  return (dispatch: Dispatch<Msg>) => {
    const num = Math.random();
    dispatch(cons(num));
  };
}
