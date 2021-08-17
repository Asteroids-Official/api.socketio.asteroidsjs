import express from 'express'
import { Server, Socket } from 'socket.io'
import { config } from 'dotenv'

import { createServer } from 'http'

config()

const port = process.env.PORT || 3000

const app = express()
const httpServer = createServer(app)
const io = new Server().listen(httpServer)

io.on('connection', (socket: Socket) => {
  console.log('Connected: ' + socket.id)
})

io.on('disconnect', (reason: string) => {
  console.log('Disconnected: ' + reason)
})

httpServer.listen(+port, () => {
  console.log('Listening on port: ' + port)
})
