import express from 'express'
import { Server, Socket } from 'socket.io'

import { config } from 'dotenv'
import { createServer } from 'http'
import { Player, PlayerInfo } from './interfaces/player.interface'

config()

const port = process.env.PORT || 3001

const app = express()
const httpServer = createServer(app)
const io = new Server().listen(httpServer)

const rooms: {
  [key: string]: { [id: string]: Player }
} = {}

io.on('connection', (socket: Socket) => {
  console.log('Connected: ' + socket.id)

  /**
   * Joins the multiplayer on-line game.
   *
   * @param playerInfo - The player information.
   * @param callback - A function to be called when the game is joined.
   */
  function joinGame(
    id = '',
    playerInfo: PlayerInfo,
    callback: (player: Player) => void,
  ): void {
    let playerId: string

    if (Object.keys(rooms).length === 0) {
      rooms['room1'] = {}
      playerId = '1'
    } else if (!id) {
      const ids = Object.keys(rooms['room1'])
        .map((id) => +id)
        .sort((id1, id2) => id1 - id2)
      playerId = ids[ids.length - 1] + 1 + ''
    }

    if (id) {
      playerId = id
    }

    const player: Player = {
      id: playerId,
      ...playerInfo,
      health: 100,
      isShooting: false,
    }

    rooms['room1'][playerId] = player

    socket.join('room1')

    callback(player)
    io.to('room1').emit('join-player', player)
  }
  socket.on('join-game', joinGame)

  /**
   * Updates a player into a specific room.
   *
   * @param room - The room that will receive the update.
   * @param player - The player that will receive the update.
   */
  function updatePlayer(room: string, player: Player): void {
    if (rooms[room]) {
      rooms[room][player.id] = player

      io.to(room).emit('update-game', rooms[room])
    }
  }
  socket.on('update-player', updatePlayer)
})

io.on('disconnect', (reason: string) => {
  console.log('Disconnected: ' + reason)
})

httpServer.listen(+port, () => {
  console.log('Listening on port: ' + port)
})
