/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import sum from '../lib/sum'

describe('sum', () => {
  it('should calculate sum of positive numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })

  it('should calculate sum of negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3)
  })
})
