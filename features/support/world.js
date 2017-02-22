/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import { defineSupportCode } from 'cucumber'
import SumService from './sum-service'

function World () {
  this.createSumService = () => new SumService()
}

defineSupportCode(({setWorldConstructor}) => {
  setWorldConstructor(World)
})
