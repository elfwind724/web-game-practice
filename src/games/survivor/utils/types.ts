export interface Vector2 {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  position: Vector2;
  size: Size;
}

export interface Velocity {
  dx: number;
  dy: number;
}

export interface GameEntity {
  position: Vector2;
  velocity: Velocity;
  size: Size;
  update(deltaTime: number): void;
  render(context: CanvasRenderingContext2D): void;
}

export type Direction = 'up' | 'down' | 'left' | 'right'; 