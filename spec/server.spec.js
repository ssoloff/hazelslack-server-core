/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import io from 'socket.io-client'
import server from '../lib/server'

function waitFor (predicate, callback) {
  if (predicate()) {
    return callback()
  }

  setTimeout(() => waitFor(predicate, callback), 100)
}

function waitForServerStart (server, callback) {
  waitFor(() => server.listening, callback)
}

function waitForServerStop (server, callback) {
  waitFor(() => !server.listening, callback)
}

describe('server', () => {
  beforeAll((done) => {
    waitForServerStart(server.public, () => {
      waitForServerStart(server.management, done)
    })
  })

  it('should shut down when requested', (done) => {
    const socket = io(`http://${server.management.address().address}:${server.management.address().port}`)
    socket.on('connect', () => {
      socket.emit('stop', () => {
        socket.close()
      })
    })

    waitForServerStop(server.public, () => {
      expect(server.public.listening).toBe(false)
      waitForServerStop(server.management, () => {
        expect(server.management.listening).toBe(false)
        done()
      })
    })
  })
})
