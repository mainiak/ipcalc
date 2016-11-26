'use strict'

const path = require('path')
const calc = require(path.join('..', 'src', 'calc.js'))

test('10_10 to 1010_2', () => {
  expect(calc.num2bin(10)).toBe('1010')
})