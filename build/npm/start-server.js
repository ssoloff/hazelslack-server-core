/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import childProcess from 'child_process'
import config from './config'
import fs from 'fs'

const child = childProcess.spawn('babel-node', [
  'lib/server.js'
], {
  detached: true,
  stdio: 'ignore'
})
child.unref()

if (typeof child.pid !== 'undefined') {
  fs.writeFileSync(config.paths.serverPid, child.pid, {
    encoding: config.encodings.serverPid
  })
}
