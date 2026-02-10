import { InputState } from '../types';
export class InputManager {
  private keys: InputState = {
    left: false,
    right: false,
    jump: false,
  };
  private listenersAttached = false;
  constructor() {
    this.attachListeners();
  }
  private handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = true;
        break;
      case 'Space':
      case 'ArrowUp':
      case 'KeyW':
        this.keys.jump = true;
        break;
    }
  };
  private handleKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = false;
        break;
      case 'Space':
      case 'ArrowUp':
      case 'KeyW':
        this.keys.jump = false;
        break;
    }
  };
  public attachListeners() {
    if (this.listenersAttached) return;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.listenersAttached = true;
  }
  public detachListeners() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.listenersAttached = false;
  }
  public getState(): InputState {
    return { ...this.keys };
  }
  public setLeft(active: boolean) { this.keys.left = active; }
  public setRight(active: boolean) { this.keys.right = active; }
  public setJump(active: boolean) { this.keys.jump = active; }
}
export const inputManager = new InputManager();
