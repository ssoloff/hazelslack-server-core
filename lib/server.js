/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import config from './config'
import express from 'express'
import httpStatus from 'http-status-codes'
import sum from './sum'

const app = express()

app.get('/api/sum', (req, res) => {
  res.status(httpStatus.OK).json({
    sum: sum(parseInt(req.query.augend, 10), parseInt(req.query.addend, 10))
  })
})

app.listen(config.port)
