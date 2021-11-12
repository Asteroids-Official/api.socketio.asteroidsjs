import express from 'express'
import cors from 'cors'
import { Server, Socket } from 'socket.io'

import { config } from 'dotenv'
import { createServer } from 'http'
import { IPlayer } from './interfaces/player.interface'
import { IRoom } from './interfaces/room.interface'
import { ISocketPlayerData } from './interfaces/socket-data.interface'

config()

const port = process.env.PORT || 3001

const app = express()
app.use(cors())

const httpServer = createServer(app)
const io = new Server({ cors: { origin: '*' } }).listen(httpServer)

const rooms: IRoom[] = [
  {
    name: 'AsteroidsJS 01 - Official',
    room: 'server01',
    players: [],
  },
  {
    name: 'AsteroidsJS 02 - Official',
    room: 'server02',
    players: [],
  },
  {
    name: 'AsteroidsJS 03 - Official',
    room: 'server03',
    players: [],
  },
  {
    name: 'AsteroidsJS 04 - Official',
    room: 'server04',
    players: [],
  },
  {
    name: 'AsteroidsJS 05 - Official',
    room: 'server05',
    players: [],
  },
  {
    name: 'AsteroidsJS 06 - Official',
    room: 'server06',
    players: [],
  },
]

io.on('connection', (socket: Socket): void => {
  console.log('Game connected: ' + socket.id)

  /**
   * Used to check how much time it takes for the client
   * to receive an answer.
   *
   * @param callback A function to be called at the end of the process.
   */
  function ping(_: never, callback: () => void): void {
    callback()
  }
  socket.on('ping', ping)

  /**
   * Returns a list of rooms to the client.
   */
  function listRooms(_: never, callback: (rooms: IRoom[]) => void): void {
    callback(rooms)
  }
  socket.on('list-rooms', listRooms)

  /**
   * Instantiates a new player into the given room.
   *
   * @param data The data that contains the player, spaceship and room data.
   */
  function instantiate(data: { data: any; room: IRoom }): void {
    io.to(data.room.room).emit(data.data)
  }
  socket.on('instantiate', instantiate)

  /**
   * Connects a player to a room room.
   *
   * @param data The data containing the player and room information.
   */
  function playerConnection(data: {
    player: IPlayer
    room: IRoom
    spaceship: unknown
  }): void {
    socket.join(data.room.room)
    io.to(data.room.room).emit('player-connected', {
      player: data.player,
      spaceship: data.spaceship,
    })
  }
  socket.on('player-connection', playerConnection)

  /**
   * Updates a player data to a room room.
   *
   * @param data The data containing the player and room information.
   */
  function updatePlayer(data: ISocketPlayerData): void {
    const roomIndex = rooms.map((s) => s.room).indexOf(data.room.room)
    const playerIndex = rooms[roomIndex].players
      .map((p) => p.id)
      .indexOf(data.player.id)

    rooms[roomIndex].players[playerIndex] = data.player

    io.to(data.room.room).emit('update-player', data.player)
  }
  socket.on('update-player', updatePlayer)

  /**
   * Updates a player status, such as 'respawn' or 'kill'.
   *
   * @param data The data containing the player data and its status and room information.
   */
  function updatePlayerStatus(data: {
    player: IPlayer
    room: IRoom
    status: string
  }): void {
    io.to(data.room.room).emit('update-player-status', {
      player: data.player,
      status: data.status,
    })
  }
  socket.on('update-player-status', updatePlayerStatus)

  /**
   * Disconnects a player from a room room.
   *
   * @param data The data containing the player and room information.
   */
  function disconnectPlayer(data: ISocketPlayerData): void {
    io.to(data.room.room).emit('player-disconnected', data.player)

    const roomIndex = rooms.map((s) => s.room).indexOf(data.room.room)
    const playerIndex = rooms[roomIndex].players
      .map((p) => p.id)
      .indexOf(data.player.id)

    rooms[roomIndex].players.splice(playerIndex, 1)
  }
  socket.on('player-disconnect', disconnectPlayer)

  /**
   * Called when a player disconnects from the room.
   *
   * @param reason The reason of the disconnection.
   */
  function disconnect(reason: string): void {
    console.log('Player disconnected: ' + socket.id + ' - ' + reason)

    const players: IPlayer[] = []

    rooms.forEach((s) => players.push(...s.players))

    const player = players.find((p) => p.socketId === socket.id)
    const room = rooms.find((s) => s.room === player?.room)

    if (room) {
      io.to(room.room).emit('player-disconnected', player)

      const roomIndex = rooms.map((s) => s.room).indexOf(room.room)
      const playerIndex = room.players.map((p) => p.id).indexOf(player.id)

      rooms[roomIndex].players.splice(playerIndex, 1)
    }
  }
  socket.on('disconnect', disconnect)
})

io.on('disconnect', (reason: string): void => {
  console.log('Disconnected: ' + reason)
})

httpServer.listen(+port, () => {
  console.log('Listening on port: ' + port)
})
