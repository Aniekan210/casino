import { Application, Assets } from "pixi.js";
import { loadStartScene } from "./GameScene";

// Create a new application
const app = new Application();
await app.init({ background: "#2b0202ff", resizeTo: window });
document.getElementById("pixi-container")!.appendChild(app.canvas);

const preload = async () => {
  const assets = [
    { alias: "balance", src: "/assets/balance.png" },
    { alias: "A", src: "/assets/A.png" },
    { alias: "B", src: "/assets/B.png" },
    { alias: "C", src: "/assets/C.png" },
    { alias: "D", src: "/assets/D.png" },
    { alias: "E", src: "/assets/E.png" },
    { alias: "slot", src: "/assets/slot.png" },
    { alias: "btn_initial", src: "/assets/spin_button_unpressed.png" },
    { alias: "btn_pressed", src: "/assets/spin_button_pressed.png" },
    { alias: "btn_na", src: "/assets/spin_btn_na.png" },
    { alias: "reset", src: "/assets/reset.png" },
  ];
  await Assets.load(assets);
};

// Game Loop
(async () => {
  await preload();

  loadStartScene(app);
})();
