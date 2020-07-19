import { dispatch } from "rxjs/internal/observable/pairs";
import { Cmd, Dispatch } from "../types";

export function none<Msg>(dispatch: Dispatch<Msg>) {}

export function batch<Msg>(cmds: Cmd<Msg>[]): Cmd<Msg> {
  return (dispatch: Dispatch<Msg>) => {
    cmds.forEach((cmd) => {
      cmd(dispatch);
    });
  };
}

export { random } from "./random";
export { http } from "./http";
