import { EMPTY, merge, Observable } from "rxjs";
import { Sub } from "../types";

export function none<Model, Msg>(model: Model): Observable<Msg> {
  return EMPTY;
}

export function batch<Model, Msg>(subs: Sub<Model, Msg>[]): Sub<Model, Msg> {
  return (model: Model) => {
    const input = subs.map((sub) => {
      return sub(model);
    });

    return merge(...input);
  };
}
