'use strict'

const path = require('path')
const calc = require(path.join('..', 'src', 'calc.js'))

test('10_10 to 1010_2', () => {
  expect(calc.dec2bin(10)).toBe('1010')
})

test('1010_2 to 10_10', () => {
  expect(calc.bin2dec('1010')).toBe(10)
})

test('255_10 to 1111_2', () => {
  expect(calc.dec2bin(255)).toBe('11111111')
})

test('1111_2 to 255_10', () => {
  expect(calc.bin2dec('11111111')).toBe(255)
})
