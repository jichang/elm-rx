import { Subject } from "rxjs";
import { scan } from "rxjs/operators";
import { Cmd, Component, Dispatch, IRuntime } from "./types";
import * as snabbdom from "snabbdom";
import classModule from "snabbdom/modules/class";
import styleModule from "snabbdom/modules/style";
import attributesModule from "snabbdom/modules/attributes";
import propsModule from "snabbdom/modules/props";
import datasetModule from "snabbdom/modules/dataset";
import eventListenersModule from "snabbdom/modules/eventlisteners";
import heroModule from "snabbdom/modules/hero";

export class Runtime<Initial, Model, Msg>
  implements IRuntime<Initial, Model, Msg> {
  run(
    rootNode: Element,
    initial: Initial,
    component: Component<Initial, Model, Msg>
  ) {
    const render = snabbdom.init([
      classModule,
      styleModule,
      attributesModule,
      propsModule,
      datasetModule,
      eventListenersModule,
      heroModule,
    ]);

    const cmdSubject = new Subject<Cmd<Msg>>();
    const msgSubject = new Subject<Msg>();

    const dispatch: Dispatch<Msg> = (msg: Msg) => {
      msgSubject.next(msg);
    };

    const [model, cmd] = component.init(initial);
    const view = component.view(model)(dispatch);
    let vnode = render(rootNode, view);

    const cmdSubscription = cmdSubject.subscribe((cmd) => {
      cmd.execute(dispatch);
    });

    const msgSubscription = msgSubject
      .pipe(
        scan((currModel: Model, msg: Msg) => {
          const [newModel, cmd] = component.update(msg)(currModel);

          cmdSubject.next(cmd);

          return newModel;
        }, model)
      )
      .subscribe((model) => {
        let view = component.view(model)(dispatch);
        vnode = render(vnode, view);
      });

    cmdSubject.next(cmd);

    return {
      stop: () => {
        cmdSubscription.unsubscribe();
        msgSubscription.unsubscribe();
      },
    };
  }
}
