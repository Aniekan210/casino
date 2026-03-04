import { Application, Container, Sprite, Texture, Ticker } from "pixi.js";
import { Reel } from "./Reel";
import { updateBalance } from "./BalanceManager";

const DESIGN_WIDTH = 739;
const DESIGN_HEIGHT = 1077;
const cost = 150;

const reel1 = new Reel();
const reel2 = new Reel();
const reel3 = new Reel();
let btn: Sprite;

export const loadSlot = (app: Application) => {
  const root = new Container();
  app.stage.addChild(root);

  btn = Sprite.from("btn_initial");
  const slot = Sprite.from("slot");

  const xPos = DESIGN_WIDTH / 2;
  const yPos = DESIGN_HEIGHT / 2;

  slot.position.set(xPos - slot.width / 2, yPos - slot.height / 2);

  reel1.position.set(slot.x * 1.14, slot.y * 1.05);
  reel2.position.set(slot.x * 1.14 + reel1.width * 1.03, slot.y * 1.05);
  reel3.position.set(
    slot.x * 1.14 + reel1.width * 1.03 + reel2.width * 1.03,
    slot.y * 1.05,
  );

  btn.position.set(DESIGN_WIDTH / 2 - btn.width / 2, DESIGN_HEIGHT - 150);

  root.addChild(slot);
  root.addChild(reel1);
  root.addChild(reel2);
  root.addChild(reel3);
  root.addChild(btn);

  const resize = () => {
    const scaleX = app.screen.width / DESIGN_WIDTH;
    const scaleY = app.screen.height / DESIGN_HEIGHT;

    const scale = Math.min(scaleX, scaleY);

    root.scale.set(scale);

    root.x = (app.screen.width - DESIGN_WIDTH * scale) / 2;
    root.y = (app.screen.height - DESIGN_HEIGHT * scale) / 2;
  };

  resize();
  window.addEventListener("resize", resize);

  reel1.spin(app.ticker);
  reel2.spin(app.ticker);
  reel3.spin(app.ticker);

  btn.interactive = true;
  btn.on("pointerdown", async () => {
    // take cost 
    updateBalance(-cost);

    // change btn state
    btn.interactive = false;
    btn.texture = Texture.from("btn_pressed");
    setTimeout(() => {
      btn.texture = Texture.from("btn_na");
    }, 300);

    // spin reels
    await spinAllReels(app.ticker);

    // check wether they won and give 8x of cost if they did
    if (
      reel1.getCurrentSymbol() == reel2.getCurrentSymbol() &&
      reel2.getCurrentSymbol() == reel3.getCurrentSymbol()
    ) {
      updateBalance(cost * 8);
    } else if (
        // if two are qual ina row reward 2 x the cost
      reel1.getCurrentSymbol() == reel2.getCurrentSymbol() ||
      reel2.getCurrentSymbol() == reel3.getCurrentSymbol()
    ) {
        updateBalance(cost*2)
    }
      // change button state back
      btn.texture = Texture.from("btn_initial");
    btn.interactive = true;
  });
};

const spinAllReels = (ticker: Ticker): Promise<void> => {
  return new Promise((resolve) => {
    let count = 0;
    const total = 4;

    const finish = () => {
      count++;
      if (count === total) {
        resolve();
      }
    };

    setTimeout(() => {
      reel1.spin(ticker);
      finish();
    }, 200);

    setTimeout(() => {
      reel2.spin(ticker);
      finish();
    }, 700);

    setTimeout(() => {
      reel3.spin(ticker);
      finish();
    }, 1200);

    setTimeout(() => {
      finish();
    }, 6000);
  });
};
