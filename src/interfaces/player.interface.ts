import { ISpaceship } from './spaceship.interface'

/**
 * Interface that represents the player data.
 */
export interface IPlayer {
  /**
   * Property that defines the player id.
   */
  id: string

  /**
   * Property that defines the player nickname.
   */
  nickname: string

  /**
   * Property that defines the player score.
   */
  score: number

  /**
   * Property that defines the player health.
   */
  health: number

  /**
   * Property that defines the player maximum health.
   */
  maxHealth: number

  /**
   * Property that defines the player spaceship data.
   */
  spaceship: ISpaceship

  /**
   * Property that defines the player socket id.
   */
  socketId: string

  /**
   * Property that defines in which room the player is
   * connected.
   */
  room: string | null
}
