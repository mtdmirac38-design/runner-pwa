export interface Vector2 {
  x: number;
  y: number;
}
export interface Size {
  width: number;
  height: number;
}
export interface Entity {
  id: string;
  pos: Vector2;
  size: Size;
  color: string;
}
export interface Player extends Entity {
  velocity: Vector2;
  isGrounded: boolean;
  canDoubleJump: boolean;
  facing: 'left' | 'right';
  invincibilityTime: number;
}
export interface Platform extends Entity {
  type: 'normal' | 'moving' | 'disappearing';
}
export interface Obstacle extends Entity {
  damage: number;
}
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}
export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}
