import { Vector2 } from '../utils/types';

export interface InputBinding {
  keys: string[];
  pressed: boolean;
}

export class InputManager {
  private static instance: InputManager;
  private keyState: Map<string, boolean>;
  private bindings: Map<string, InputBinding>;
  private mousePosition: Vector2;

  private constructor() {
    this.keyState = new Map();
    this.bindings = new Map();
    this.mousePosition = { x: 0, y: 0 };
    this.initializeEventListeners();
  }

  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }
    return InputManager.instance;
  }

  private initializeEventListeners(): void {
    window.addEventListener('keydown', (event) => this.handleKeyDown(event));
    window.addEventListener('keyup', (event) => this.handleKeyUp(event));
    window.addEventListener('mousemove', (event) => this.handleMouseMove(event));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keyState.set(key, true);
    this.updateBindings(key, true);
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keyState.set(key, false);
    this.updateBindings(key, false);
  }

  private handleMouseMove(event: MouseEvent): void {
    this.mousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }

  private updateBindings(key: string, pressed: boolean): void {
    this.bindings.forEach((binding, action) => {
      if (binding.keys.includes(key)) {
        binding.pressed = binding.keys.some(k => this.keyState.get(k));
      }
    });
  }

  public addBinding(action: string, keys: string[]): void {
    this.bindings.set(action, {
      keys: keys.map(k => k.toLowerCase()),
      pressed: false
    });
  }

  public isActionPressed(action: string): boolean {
    return this.bindings.get(action)?.pressed ?? false;
  }

  public isKeyPressed(key: string): boolean {
    return this.keyState.get(key.toLowerCase()) ?? false;
  }

  public getMousePosition(): Vector2 {
    return { ...this.mousePosition };
  }

  public clearState(): void {
    this.keyState.clear();
    this.bindings.forEach(binding => binding.pressed = false);
  }
} 