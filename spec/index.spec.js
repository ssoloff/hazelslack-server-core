/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import hazelslackServerCore from '../lib'

describe('index', () => {
  describe('.sum', () => {
    it('should calculate sum of positive numbers', () => {
      expect(hazelslackServerCore.sum(1, 2)).toBe(3)
    })

    it('should calculate sum of negative numbers', () => {
      expect(hazelslackServerCore.sum(-1, -2)).toBe(-3)
    })
  })
})
