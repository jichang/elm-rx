import { Cmd, Dispatch } from "../types";

export function none<Msg>(dispatch: Dispatch<Msg>) {}

export { random } from "./random";
export { http } from "./http";
