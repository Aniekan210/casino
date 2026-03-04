import { Application, Renderer, Container } from "pixi.js";
import { loadBalanceCont } from "./BalanceManager";
import { loadSlot } from "./Slots";

// reference to scene container and start button
const container = new Container();

export const loadStartScene = (app: Application<Renderer>) => {
  container.position.set(0, 0);
  container.width = app.screen.width;
  container.height = app.screen.height;
  container.origin.set(app.screen.width / 2, app.screen.height / 2);
  loadBalanceCont(app, container);
  loadSlot(app);
  app.stage.addChild(container);
};