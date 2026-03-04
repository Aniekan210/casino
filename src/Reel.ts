import { Container, Sprite, Texture, Ticker, Graphics } from "pixi.js";

type SymbolType = "A" | "B" | "C" | "D" | "E";

export class Reel extends Container {
  private symbols: SymbolType[] = ["A", "B", "C", "D", "E"];

  private viewport: Container = new Container(); // holds spinning symbols
  private symbolSprites: Sprite[] = [];

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

  /** Creates mask so only ONE symbol is visible */
  private setupMask() {
    this.addChild(this.viewport);

    const maskShape = new Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, this.symbolWidth, this.symbolHeight)
      .endFill();

    this.addChild(maskShape);
    this.viewport.mask = maskShape;
  }

  /** Creates initial stacked symbols */
  private buildInitialStack() {
    for (let i = 0; i < this.totalStack; i++) {
      const sprite = this.createSymbolSprite(this.getRandomSymbol());
      sprite.y = i * this.symbolHeight;
      this.symbolSprites.push(sprite);
      this.viewport.addChild(sprite);
    }
  }

  /** Creates a sprite from preloaded alias */
  private createSymbolSprite(symbol: SymbolType): Sprite {
    const sprite = Sprite.from(symbol);
    sprite.width = this.symbolWidth;
    sprite.height = this.symbolHeight;
    (sprite as any).symbolType = symbol;
    return sprite;
  }

  private getRandomSymbol(): SymbolType {
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }

  /** Spins the reel using Pixi's Ticker */
  public spin(ticker: Ticker) {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.targetSymbol = this.getRandomSymbol();

    const spinDuration = 2000 + Math.random() * 1000;
    const startTime = performance.now();
    this.speed = 25 + Math.random() * 10;

    const update = () => {
      const elapsed = performance.now() - startTime;

      // move symbols downward
      for (const sprite of this.symbolSprites) {
        sprite.y += this.speed;

        // loop symbol to top
        if (sprite.y >= this.symbolHeight * this.totalStack) {
          sprite.y -= this.symbolHeight * this.totalStack;
          const newSymbol = this.getRandomSymbol();
          sprite.texture = Texture.from(newSymbol);
          (sprite as any).symbolType = newSymbol;
        }
      }

      // after duration, slow down
      if (elapsed >= spinDuration) {
        this.speed *= 0.96;

        if (this.speed < 1.5) {
          // force a visible sprite to become target
          const visibleSprite = this.symbolSprites.reduce((prev, curr) =>
            curr.y > prev.y ? curr : prev,
          );

          visibleSprite.texture = Texture.from(this.targetSymbol!);
          (visibleSprite as any).symbolType = this.targetSymbol!;

          this.snapToTarget(visibleSprite);

          ticker.remove(update);
          this.isSpinning = false;
        }
      }
    };

    ticker.add(update);
  }

  /** Snap a sprite to be perfectly centered in the mask */
  private snapToTarget(targetSprite: Sprite) {
    const visibleCenterY = this.symbolHeight / 2;
    const offset = visibleCenterY - (targetSprite.y + this.symbolHeight / 2);

    for (const sprite of this.symbolSprites) {
      sprite.y += offset;
    }
  }

  /** Returns symbol currently visible */
  public getCurrentSymbol(): SymbolType | null {
    const visibleY = 0;

    const current = this.symbolSprites.find(
      (s) =>
        s.y <= visibleY + this.symbolHeight &&
        s.y + this.symbolHeight >= visibleY,
    );

    return current ? ((current as any).symbolType as SymbolType) : null;
  }
}
