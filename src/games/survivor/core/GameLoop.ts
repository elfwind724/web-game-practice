export class GameLoop {
  private static instance: GameLoop;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private updateCallback: ((deltaTime: number) => void) | null = null;
  private renderCallback: (() => void) | null = null;

  private constructor() {}

  public static getInstance(): GameLoop {
    if (!GameLoop.instance) {
      GameLoop.instance = new GameLoop();
    }
    return GameLoop.instance;
  }

  public setCallbacks(
    update: (deltaTime: number) => void,
    render: () => void
  ): void {
    this.updateCallback = update;
    this.renderCallback = render;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isRunning = false;
  }

  private tick = (): void => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    if (this.updateCallback) {
      this.updateCallback(deltaTime);
    }

    if (this.renderCallback) {
      this.renderCallback();
    }

    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(this.tick);
    }
  };
} 