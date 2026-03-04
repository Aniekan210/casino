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
  balanceImage.scale = 0.5;
  balanceImage.anchor.set(0, 0);
  balanceImage.position.set(app.screen.width * 0.02, app.screen.height * 0.02);

  let stored = localStorage.getItem(key);
  balance = stored !== null ? Number(stored) : 1000;
  localStorage.setItem(key, balance.toString());

  text = new Text({
    text: `${balance.toLocaleString()}`,
    style: {
      fontFamily: "Helvetica",
      fontSize: 26,
      fill: 0xffffff,
      align: "left",
    },
  });
  text.anchor.set(0, 0);
  text.position.set(
    app.screen.width * 0.02 + balanceImage.width,
    app.screen.height * 0.02 + balanceImage.height / 2 - text.height / 2,
  );

  const resetBtn = Sprite.from("reset");
  resetBtn.scale = 0.5;
  resetBtn.position.set(app.screen.width * 0.98 - resetBtn.width, 0);

  resetBtn.interactive = true;
  resetBtn.on("click", () => {
    resetBalance();
  });

  balanceCont.addChild(balanceImage);
  balanceCont.addChild(text);
  parent.addChild(balanceCont);
  parent.addChild(resetBtn);
};

export const updateBalance = (change: number) => {
  if (balance + change >= 0) {
    balance = balance + change;
    localStorage.setItem(key, balance.toString());
    text.text = `${balance.toLocaleString()}`;
  }
};

export const resetBalance = () => {
  balance = 1000;
  localStorage.setItem(key, balance.toString());
  text.text = `${balance.toLocaleString()}`;
};
