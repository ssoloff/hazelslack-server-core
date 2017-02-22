/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import config from './config'
import express from 'express'
import http from 'http'
import httpStatus from 'http-status-codes'
import Server from 'socket.io'
import sum from './sum'

const app = express()
app.get('/api/sum', (req, res) => {
  res.status(httpStatus.OK).json({
    sum: sum(parseInt(req.query.augend, 10), parseInt(req.query.addend, 10))
  })
})

const publicServer = http.createServer(app)
publicServer.listen(config.publicPort)

const managementServer = http.createServer()
const io = new Server(managementServer)
io.on('connection', (socket) => {
  socket.on('stop', (reply) => {
    if (reply) {
      reply('ok')
    }
    publicServer.close()
    managementServer.close()
  })
})

managementServer.listen(config.managementPort, 'localhost')

export default {
  management: managementServer,
  public: publicServer
}
