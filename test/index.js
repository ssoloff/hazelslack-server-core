/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import assert from 'assert'
import hazelslackServerCore from '../lib'

describe('hazelslack-server-core', function () {
  it('should have unit test!', function () {
    assert(hazelslackServerCore.sum(1, 2) === 3, 'we expected this package author to add actual unit tests.')
  })
})
