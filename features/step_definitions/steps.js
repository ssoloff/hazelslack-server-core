/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import { expect } from 'chai'
import { defineSupportCode } from 'cucumber'
import httpStatus from 'http-status-codes'

defineSupportCode(({Given, When, Then}) => {
  Given('the addend {int}', function (addend) {
    this.sumService.setAddend(addend)
  })

  Given('the augend {int}', function (augend) {
    this.sumService.setAugend(augend)
  })

  When('the sum service is invoked', function (callback) {
    this.sumService.call((res) => {
      this.res = res
      callback()
    })
  })

  Then('the response should contain the sum {int}', function (sum) {
    expect(this.res.statusCode).to.equal(httpStatus.OK)
    expect(this.res.body.sum).to.equal(sum)
  })
})
