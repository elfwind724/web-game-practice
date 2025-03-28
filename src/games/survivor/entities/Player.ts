import { GameEntity, Vector2, Velocity, Size } from '../utils/types';
import { InputManager } from '../core/InputManager';

export class Player implements GameEntity {
  public position: Vector2;
  public velocity: Velocity;
  public size: Size;
  private speed: number;
  private inputManager: InputManager;

  constructor(position: Vector2, size: Size) {
    this.position = position;
    this.size = size;
    this.velocity = { dx: 0, dy: 0 };
    this.speed = 200; // pixels per second
    this.inputManager = InputManager.getInstance();
    this.setupInputBindings();
  }

  private setupInputBindings(): void {
    this.inputManager.addBinding('moveUp', ['w', 'ArrowUp']);
    this.inputManager.addBinding('moveDown', ['s', 'ArrowDown']);
    this.inputManager.addBinding('moveLeft', ['a', 'ArrowLeft']);
    this.inputManager.addBinding('moveRight', ['d', 'ArrowRight']);
  }

  public update(deltaTime: number): void {
    // Reset velocity
    this.velocity = { dx: 0, dy: 0 };

    // Update velocity based on input
    if (this.inputManager.isActionPressed('moveUp')) {
      this.velocity.dy = -this.speed;
    }
    if (this.inputManager.isActionPressed('moveDown')) {
      this.velocity.dy = this.speed;
    }
    if (this.inputManager.isActionPressed('moveLeft')) {
      this.velocity.dx = -this.speed;
    }
    if (this.inputManager.isActionPressed('moveRight')) {
      this.velocity.dx = this.speed;
    }

    // Normalize diagonal movement
    if (this.velocity.dx !== 0 && this.velocity.dy !== 0) {
      const normalizer = 1 / Math.sqrt(2);
      this.velocity.dx *= normalizer;
      this.velocity.dy *= normalizer;
    }

    // Update position
    this.position.x += this.velocity.dx * deltaTime;
    this.position.y += this.velocity.dy * deltaTime;
  }

  public render(context: CanvasRenderingContext2D): void {
    context.fillStyle = 'blue';
    context.fillRect(
      this.position.x - this.size.width / 2,
      this.position.y - this.size.height / 2,
      this.size.width,
      this.size.height
    );
  }
} 