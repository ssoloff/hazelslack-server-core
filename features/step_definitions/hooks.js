/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import { defineSupportCode } from 'cucumber'

defineSupportCode(({Before}) => {
  Before(function (scenario, callback) {
    this.sumService = this.createSumService()
    this.res = null
    callback()
  })
})
