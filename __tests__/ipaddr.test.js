/* global test expect */
'use strict'

const path = require('path')
const IPv4 = require(path.join('..', 'src', 'ipaddr.js'))

test('Empty constructor', () => {
  let ipAddr = new IPv4()
  expect(ipAddr.dotNotation()).toBe('0.0.0.0')
})
