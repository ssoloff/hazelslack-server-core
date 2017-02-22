/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import config from './config'
import request from 'request'

export default class SumService {
  constructor () {
    this.reqQueryParams = {}
  }

  call (callback) {
    const reqData = {
      json: true,
      qs: this.reqQueryParams,
      uri: `${config.baseUri}/api/sum`
    }
    request.get(reqData, (err, res) => {
      if (!err) {
        callback(res)
      } else {
        throw new Error(err)
      }
    })
  }

  setAddend (addend) {
    this.reqQueryParams.addend = addend
  }

  setAugend (augend) {
    this.reqQueryParams.augend = augend
  }
}
