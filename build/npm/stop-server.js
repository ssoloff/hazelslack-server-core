/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import config from './config'
import fs from 'fs'
import kill from 'tree-kill'

const serverPid = fs.readFileSync(config.paths.serverPid, {
  encoding: config.encodings.serverPid
})
fs.unlinkSync(config.paths.serverPid)

kill(serverPid)
