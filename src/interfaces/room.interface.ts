import { IPlayer } from './player.interface'

/**
 * Interface that represents the room data.
 */
export interface IRoom {
  /**
   * Property that defines the room name.
   */
  name: string

  /**
   * Property that defines the socket room name.
   */
  room: string

  /**
   * Property that defines an array of players from the room.
   */
  players: IPlayer[]
}
