import {
  Container,
  Sprite,
  Texture,
  Ticker,
  Graphics,
} from "pixi.js";

type SymbolType = "A" | "B" | "C" | "D" | "E";

/** Dedicated sprite class for symbols */
class SymbolSprite extends Sprite {
  public symbolType: SymbolType;

  constructor(symbol: SymbolType) {
    super(Texture.from(symbol));
    this.symbolType = symbol;
  }
}

export class Reel extends Container {
  private symbols: SymbolType[] = ["A", "B", "C", "D", "E"];
  private viewport: Container = new Container();
  private symbolSprites: SymbolSprite[] = [];
  private symbolHeight = 160;
  private symbolWidth = 110;
  private totalStack = 10;

  private speed = 0;
  private isSpinning = false;
  private targetSymbol: SymbolType | null = null;

  constructor() {
    super();
    this.setupMask();
    this.buildInitialStack();
  }

  private setupMask() {
    this.addChild(this.viewport);
    const maskShape = new Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, this.symbolWidth, this.symbolHeight)
      .endFill();
    this.addChild(maskShape);
    this.viewport.mask = maskShape;
  }

  private buildInitialStack() {
    for (let i = 0; i < this.totalStack; i++) {
      const sprite = this.createSymbolSprite(this.getRandomSymbol());
      sprite.y = i * this.symbolHeight;
      this.symbolSprites.push(sprite);
      this.viewport.addChild(sprite);
    }
  }

  private createSymbolSprite(symbol: SymbolType): SymbolSprite {
    const sprite = new SymbolSprite(symbol);
    sprite.width = this.symbolWidth;
    sprite.height = this.symbolHeight;
    return sprite;
  }

  private getRandomSymbol(): SymbolType {
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }

  /** Spins the reel and returns a Promise that resolves when spin is done */
  public spin(ticker: Ticker): Promise<void> {
    return new Promise((resolve) => {
      if (this.isSpinning) return resolve();

      this.isSpinning = true;
      this.targetSymbol = this.getRandomSymbol();
      const spinDuration = 2000 + Math.random() * 1000;
      const startTime = performance.now();
      this.speed = 25 + Math.random() * 10;

      const update = () => {
        const elapsed = performance.now() - startTime;

        for (const sprite of this.symbolSprites) {
          sprite.y += this.speed;

          if (sprite.y >= this.symbolHeight * this.totalStack) {
            sprite.y -= this.symbolHeight * this.totalStack;
            const newSymbol = this.getRandomSymbol();
            sprite.texture = Texture.from(newSymbol);
            sprite.symbolType = newSymbol;
          }
        }

        if (elapsed >= spinDuration) {
          this.speed *= 0.96;

          if (this.speed < 1.5) {
            const visibleSprite = this.symbolSprites.reduce((prev, curr) =>
              curr.y > prev.y ? curr : prev,
            );

            visibleSprite.texture = Texture.from(this.targetSymbol!);
            visibleSprite.symbolType = this.targetSymbol!;
            this.snapToTarget(visibleSprite);

            ticker.remove(update);
            this.isSpinning = false;
            resolve();
          }
        }
      };

      ticker.add(update);
    });
  }

  private snapToTarget(targetSprite: SymbolSprite) {
    const visibleCenterY = this.symbolHeight / 2;
    const offset = visibleCenterY - (targetSprite.y + this.symbolHeight / 2);

    for (const sprite of this.symbolSprites) {
      sprite.y += offset;
    }
  }

  /** Returns the symbol currently visible */
  public getCurrentSymbol(): SymbolType {
    const centerY = this.symbolHeight / 2;
    let closest = this.symbolSprites[0];
    let minDist = Math.abs(closest.y + this.symbolHeight / 2 - centerY);

    for (const s of this.symbolSprites) {
      const dist = Math.abs(s.y + this.symbolHeight / 2 - centerY);
      if (dist < minDist) {
        closest = s;
        minDist = dist;
      }
    }

    return closest.symbolType;
  }
}
