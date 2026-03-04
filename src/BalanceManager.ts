import { Application, Container, Renderer, Sprite, Text } from "pixi.js";

let balanceCont: Container;
let balance: number;
let text: Text;
const key = "balance";

export const loadBalanceCont = (
  app: Application<Renderer>,
  parent: Container,
) => {
  balanceCont = new Container();

  const balanceImage = Sprite.from("balance");
  balanceImage.scale.set(0.5);
  balanceImage.anchor.set(0, 0);
  balanceImage.position.set(app.screen.width * 0.02, app.screen.height * 0.02);

  const stored = localStorage.getItem(key);
  balance = stored !== null ? Number(stored) : 1000;
  localStorage.setItem(key, balance.toString());

  text = new Text(`${balance.toLocaleString()}`, {
    fontFamily: "Helvetica",
    fontSize: 26,
    fill: 0xffffff,
    align: "left",
  });
  text.anchor.set(0, 0);
  text.position.set(
    balanceImage.x + balanceImage.width,
    balanceImage.y + balanceImage.height / 2 - text.height / 2,
  );

  // Reset button
  const resetBtn = Sprite.from("reset");
  resetBtn.scale.set(0.5);
  resetBtn.anchor.set(1, 0); // align to top-right
  resetBtn.position.set(app.screen.width * 0.98, app.screen.height * 0.02);

  resetBtn.interactive = true;

  // Use pointerdown for mobile/touch support
  resetBtn.on("pointerdown", () => {
    resetBalance();
  });

  balanceCont.addChild(balanceImage, text, resetBtn);
  parent.addChild(balanceCont);
};

export const updateBalance = (change: number) => {
  if (balance + change >= 0) {
    balance += change;
    localStorage.setItem(key, balance.toString());
    text.text = `${balance.toLocaleString()}`;
  }
};

export const resetBalance = () => {
  balance = 1000;
  localStorage.setItem(key, balance.toString());
  text.text = `${balance.toLocaleString()}`;
};
