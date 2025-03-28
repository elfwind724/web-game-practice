import { GameEntity, Vector2, Velocity, Size } from '../utils/types';

export class Enemy implements GameEntity {
  public position: Vector2;
  public velocity: Velocity;
  public size: Size;
  private speed: number;
  private target: GameEntity | null = null;

  constructor(position: Vector2, size: Size) {
    this.position = position;
    this.size = size;
    this.velocity = { dx: 0, dy: 0 };
    this.speed = 100; // pixels per second
  }

  public setTarget(target: GameEntity): void {
    this.target = target;
  }

  public update(deltaTime: number): void {
    if (!this.target) return;

    // Calculate direction to target
    const dx = this.target.position.x - this.position.x;
    const dy = this.target.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // Normalize direction and apply speed
      this.velocity = {
        dx: (dx / distance) * this.speed,
        dy: (dy / distance) * this.speed
      };

      // Update position
      this.position.x += this.velocity.dx * deltaTime;
      this.position.y += this.velocity.dy * deltaTime;
    }
  }

  public render(context: CanvasRenderingContext2D): void {
    context.fillStyle = 'red';
    context.fillRect(
      this.position.x - this.size.width / 2,
      this.position.y - this.size.height / 2,
      this.size.width,
      this.size.height
    );
  }
} 