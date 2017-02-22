#
# Copyright (C) 2017 Steven Soloff
#
# This software is licensed under the terms of the GNU Affero General Public
# License version 3 or later (https://www.gnu.org/licenses/).
#

Feature: Calculating sums
  In order to ensure correct mathematical calculations
  As a user
  I want to be able to sum two numbers

Scenario Outline: Evaluating sums
  Given the augend <augend>
    And the addend <addend>
  When the sum service is invoked
  Then the response should contain the sum <sum>
  Examples:
    | augend | addend | sum |
    |  0     |  0     |  0  |
    |  1     |  2     |  3  |
    | -1     |  2     |  1  |
    |  1     | -2     | -1  |
    | -1     | -2     | -3  |
