import { VNode } from "snabbdom/vnode";

export type Dispatch<Msg> = (msg: Msg) => void;

export type Cmd<Msg> = (dispatch: Dispatch<Msg>) => void;

export interface Component<Initial, Model, Msg> {
  init: (initial: Initial) => [Model, Cmd<Msg>];
  update: (msg: Msg) => (model: Model) => [Model, Cmd<Msg>];
  view: (model: Model) => (dispatch: Dispatch<Msg>) => VNode;
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
