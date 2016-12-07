/* global test expect */
'use strict'

const path = require('path')
const IPv4 = require(path.join('..', 'src', 'ipaddr.js'))

test('Empty constructor', () => {
  let ipAddr = new IPv4()
  expect(ipAddr.dotNotation()).toBe('0.0.0.0')
  expect(ipAddr.binNotation()).toBe('00000000.00000000.00000000.00000000')
})

test('Array constructor', () => {
  let ipAddr = new IPv4([1, 2, 3, 4])
  expect(ipAddr.dotNotation()).toBe('1.2.3.4')
})
