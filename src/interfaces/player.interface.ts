import { Vector2 } from './vector2.interface'

export interface PlayerInfo {
  name: string
  color: string
  vector: Vector2
}

export interface Player extends PlayerInfo {
  id: string
  health: number
  isShooting: boolean
}
