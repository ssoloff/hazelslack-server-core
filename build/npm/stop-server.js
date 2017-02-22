/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import config from '../../lib/config'
import io from 'socket.io-client'

const socket = io(`http://localhost:${config.managementPort}`)
socket.on('connect', () => {
  socket.emit('stop', () => {
    socket.close()
  })
})
