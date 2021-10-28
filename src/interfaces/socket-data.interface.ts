import { IPlayer } from './player.interface'
import { IRoom } from './room.interface'

/**
 * Interface that represents the received socket data.
 */
export interface ISocketPlayerData {
  /**
   * Property that defines the player information.
   */
  player: IPlayer

  /**
   * Property that defines the room information.
   */
  room: IRoom
}
