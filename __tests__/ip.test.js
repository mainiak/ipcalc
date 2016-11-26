'use strict'

const path = require('path')
const ip = require(path.join('..', 'src', 'ip.js'))

test('Valid', () => {
  expect(ip.validate('192.168.0.1')).toBe('OK')
})

test('Valid /8', () => {
  expect(ip.validate('255.0.0.0')).toBe('OK')
})

test('Valid /16', () => {
  expect(ip.validate('255.255.0.0')).toBe('OK')
})


test('Valid /32', () => {
  expect(ip.validate('255.255.255.0')).toBe('OK')
})

test('Valid 250-255', () => {
  expect(ip.validate('250.251.252.255')).toBe('OK')
})

test('Valid 200-299', () => {
  expect(ip.validate('200.221.239.249')).toBe('OK')
})

test('Valid 100-199', () => {
  expect(ip.validate('100.128.150.199')).toBe('OK')
})

test('Valid <100', () => {
  expect(ip.validate('1.099.010.10')).toBe('OK')
})