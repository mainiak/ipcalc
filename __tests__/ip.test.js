/*global test expect*/
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

test('Valid IP with /16', () => {
  expect(ip.validate('192.168.0.0/16')).toBe('OK')
})

test('Valid IP with /8', () => {
  expect(ip.validate('10.00.0.0/8')).toBe('OK')
})

test('Invalid netmask', () => {
  expect(ip.validate('10.10.0.0/40')).toBe('Invalid netmask')
})

test('Private network 0', () => {
  expect(ip.PRIVATE_NETWORKS.length).toBe(3)
})

test('Private network 1', () => {
  let network = ip.PRIVATE_NETWORKS[0]
  expect(ip.validate(network)).toBe('OK')
})

test('Private network 2', () => {
  let network = ip.PRIVATE_NETWORKS[1]
  expect(ip.validate(network)).toBe('OK')
})

test('Private network 3', () => {
  let network = ip.PRIVATE_NETWORKS[2]
  expect(ip.validate(network)).toBe('OK')
})

test('IPV4LL - bellow range', () => {
  expect(ip.isIPv4LL('169.254.0.1')).toBe(false)
})

test('IPV4LL - above range', () => {
  expect(ip.isIPv4LL('169.254.3.7')).toBe(true)
})

test('IPV4LL - above range', () => {
  expect(ip.isIPv4LL('169.254.255.1')).toBe(false)
})
