import { Subject, Subscription } from "rxjs";
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
import { none } from "./Cmd";

export class Runtime<Initial, Model, Msg>
  implements IRuntime<Initial, Model, Msg> {
  subscription: Subscription = null;

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
      cmd(dispatch);
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

        if (this.subscription) {
          this.subscription.unsubscribe();
        }

        this.subscription = component.subscriptions(model).subscribe((msg) => {
          msgSubject.next(msg);
        });
      });

    cmdSubject.next(cmd);

    if (component.subscriptions) {
      this.subscription = component.subscriptions(model).subscribe((msg) => {
        msgSubject.next(msg);
      });
    }

    return {
      stop: () => {
        cmdSubscription.unsubscribe();
        msgSubscription.unsubscribe();
      },
    };
  }
}
