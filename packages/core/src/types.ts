import { Observable } from "rxjs";
import { VNode } from "snabbdom/vnode";

export type Dispatch<Msg> = (msg: Msg) => void;

export type Cmd<Msg> = (dispatch: Dispatch<Msg>) => void;

export type Sub<Model, Msg> = (model: Model) => Observable<Msg>;

export interface Component<Initial, Model, Msg> {
  init: (initial: Initial) => [Model, Cmd<Msg>];
  update: (msg: Msg) => (model: Model) => [Model, Cmd<Msg>];
  view: (model: Model) => (dispatch: Dispatch<Msg>) => VNode;
  subscriptions?: Sub<Model, Msg>;
}

export interface IRuntime<Initial, Model, Msg> {
  run: (
    rootNode: Element,
    initial: Initial,
    component: Component<Initial, Model, Msg>
  ) => {
    stop: () => void;
  };
}
