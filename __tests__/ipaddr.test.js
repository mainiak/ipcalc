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

test('Invalid constructor', () => {
  expect(() => {
    return new IPv4(1234)
  }).toThrowError('Invalid type: number')
})

test('Invalid string constructor', () => {
  expect(() => {
    return new IPv4('bla bla')
  }).toThrowError('FIX - String arg') // FIXME
})

test('Clone constructor', () => {
  let ipAddr1 = new IPv4([1, 2, 3, 4])
  let ipAddr2 = new IPv4(ipAddr1)
  expect(ipAddr1).not.toBe(ipAddr2)
  expect(ipAddr1.dotNotation()).toBe(ipAddr2.dotNotation())
})

/*
test('String constructor', () => {
  let ipAddr = new IPv4('1.2.3.4')
  expect(ipAddr.binNotation()).toBe('11111111.11110000.00000000.00000000')
})
*/

test('String netmask constructor - bellow lower range', () => {
  expect(() => {
    return new IPv4('/0')
  }).toThrowError('Invalid netmask /0')
})

test('String netmask constructor - above higher range', () => {
  expect(() => {
    return new IPv4('/32')
  }).toThrowError('Invalid netmask /32')
})

test('String netmask constructor - lower border case 1', () => {
  let ipAddr = new IPv4('/1')
  expect(ipAddr.binNotation()).toBe('10000000.00000000.00000000.00000000')
})

test('String netmask constructor - lower border case 2', () => {
  let ipAddr = new IPv4('/2')
  expect(ipAddr.binNotation()).toBe('11000000.00000000.00000000.00000000')
})

test('String netmask constructor', () => {
  let ipAddr = new IPv4('/12')
  expect(ipAddr.binNotation()).toBe('11111111.11110000.00000000.00000000')
})

test('String netmask constructor - higher border case', () => {
  let ipAddr = new IPv4('/31')
  expect(ipAddr.binNotation()).toBe('11111111.11111111.11111111.11111110')
})

test('isNetmask() - nope', () => {
  let ipAddr = new IPv4([192, 168, 1, 2])
  expect(ipAddr.isNetmask()).toBe(false)
})

test('isNetmask() /8', () => {
  let ipAddr = new IPv4([255, 0, 0, 0])
  expect(ipAddr.isNetmask()).toBe(true)
})

test('isNetmask() /16', () => {
  let ipAddr = new IPv4([255, 255, 0, 0])
  expect(ipAddr.isNetmask()).toBe(true)
})

test('isNetmask() /24', () => {
  let ipAddr = new IPv4([255, 255, 255, 0])
  expect(ipAddr.isNetmask()).toBe(true)
})

test('IPv4.compare() - Invalid 1st argument', () => {
  expect(() => {
    IPv4.compare()
  }).toThrowError('First argument is not IPv4 object')
})

test('IPv4.compare() - Invalid 2nd argument', () => {
  let ipAddr1 = new IPv4()
  expect(() => {
    IPv4.compare(ipAddr1)
  }).toThrowError('Second argument is not IPv4 object')
})

test('IPv4.compare() - equal', () => {
  let ipAddr1 = new IPv4()
  let ipAddr2 = new IPv4()
  expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(0)
})

test('IPv4.compare() - octet 1 higher', () => {
  let ipAddr1 = new IPv4([1, 0, 0, 0])
  let ipAddr2 = new IPv4([0, 0, 0, 0])
  expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(1)
})

test('IPv4.compare() - octet 1 lower', () => {
  let ipAddr1 = new IPv4([0, 0, 0, 0])
  let ipAddr2 = new IPv4([1, 0, 0, 0])
  expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(-1)
})

test('IPv4.compare() - octet 2 higher', () => {
  let ipAddr1 = new IPv4([0, 1, 0, 0])
  let ipAddr2 = new IPv4([0, 0, 0, 0])
  expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(1)
})

test('IPv4.compare() - octet 2 lower', () => {
  let ipAddr1 = new IPv4([0, 0, 0, 0])
  let ipAddr2 = new IPv4([0, 1, 0, 0])
  expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(-1)
})

test('IPv4.compare() - octet 3 higher', () => {
  let ipAddr1 = new IPv4([0, 0, 1, 0])
  let ipAddr2 = new IPv4([0, 0, 0, 0])
  expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(1)
})

test('IPv4.compare() - octet 3 lower', () => {
  let ipAddr1 = new IPv4([0, 0, 0, 0])
  let ipAddr2 = new IPv4([0, 0, 1, 0])
  expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(-1)
})

test('IPv4.compare() - octet 4 higher', () => {
  let ipAddr1 = new IPv4([0, 0, 0, 1])
  let ipAddr2 = new IPv4([0, 0, 0, 0])
  expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(1)
})

test('IPv4.compare() - octet 4 lower', () => {
  let ipAddr1 = new IPv4([0, 0, 0, 0])
  let ipAddr2 = new IPv4([0, 0, 0, 1])
  expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(-1)
})

test('isInRange() - Invalid 1st argument', () => {
  let ipAddr = new IPv4([192, 168, 1, 2])
  expect(() => {
    ipAddr.isInRange()
  }).toThrowError('First argument is not IPv4 object')
})

test('isInRange() - Invalid 2nd argument', () => {
  let ipAddr = new IPv4([192, 168, 1, 2])
  let ipAddrLow = new IPv4([192, 168, 0, 0])
  expect(() => {
    ipAddr.isInRange(ipAddrLow)
  }).toThrowError('Second argument is not IPv4 object')
})

test('isInRange() - lower border', () => {
  let ipAddrLow = new IPv4([192, 168, 0, 0])
  let ipAddrHigh = new IPv4([192, 168, 255, 255])
  expect(ipAddrLow.isInRange(ipAddrLow, ipAddrHigh)).toBe(true)
})

test('isInRange() - higher border', () => {
  let ipAddrLow = new IPv4([192, 168, 0, 0])
  let ipAddrHigh = new IPv4([192, 168, 255, 255])
  expect(ipAddrHigh.isInRange(ipAddrLow, ipAddrHigh)).toBe(true)
})

test('isInRange() - in range', () => {
  let ipAddr = new IPv4([192, 168, 1, 2])
  let ipAddrLow = new IPv4([192, 168, 0, 0])
  let ipAddrHigh = new IPv4([192, 168, 255, 255])
  expect(ipAddr.isInRange(ipAddrLow, ipAddrHigh)).toBe(true)
})

test('isInRange() - in range & swap order', () => {
  let ipAddr = new IPv4([192, 168, 1, 2])
  let ipAddrLow = new IPv4([192, 168, 0, 0])
  let ipAddrHigh = new IPv4([192, 168, 255, 255])
  expect(ipAddr.isInRange(ipAddrHigh, ipAddrLow)).toBe(true)
})

test('isInRange() - bellow range', () => {
  let ipAddr = new IPv4([10, 10, 1, 2])
  let ipAddrLow = new IPv4([192, 168, 0, 0])
  let ipAddrHigh = new IPv4([192, 168, 255, 255])
  expect(ipAddr.isInRange(ipAddrLow, ipAddrHigh)).toBe(false)
})

test('isInRange() - above range', () => {
  let ipAddr = new IPv4([200, 200, 1, 2])
  let ipAddrLow = new IPv4([192, 168, 0, 0])
  let ipAddrHigh = new IPv4([192, 168, 255, 255])
  expect(ipAddr.isInRange(ipAddrLow, ipAddrHigh)).toBe(false)
})

test('IPv4.info() - invalid 1st argument', () => {
  expect(() => {
    IPv4.info()
  }).toThrowError('First argument is not IPv4 object')
})

test('IPv4.info() - invalid 2nd argument', () => {
  let ipAddr1 = new IPv4([1, 2, 3, 4])
  expect(() => {
    IPv4.info(ipAddr1)
  }).toThrowError('Second argument is not IPv4 object')
})

test('IPv4.info() - invalid 2nd argument', () => {
  let ipAddr1 = new IPv4([1, 2, 3, 4])
  let ipAddr2 = new IPv4([1, 2, 3, 4])
  expect(() => {
    IPv4.info(ipAddr1, ipAddr2)
  }).toThrowError('Second argument is not a netmask')
})

test('IPv4.info()', () => {
  let ipAddr = new IPv4([172, 18, 3, 4])
  let netmask = new IPv4('/12')
  let infoObj = IPv4.info(ipAddr, netmask)
  expect(typeof infoObj).toBe('object')

  expect(infoObj.ipAddr instanceof IPv4).toBe(true)
  expect(infoObj.netmask instanceof IPv4).toBe(true)
  expect(infoObj._invertedNetmask instanceof IPv4).toBe(true)
  expect(infoObj.networkIP instanceof IPv4).toBe(true)
  expect(infoObj.broadcast instanceof IPv4).toBe(true)

  expect(infoObj.ipAddr).not.toBe(ipAddr)
  expect(infoObj.netmask).not.toBe(netmask)

  expect(infoObj.networkIP.dotNotation()).toBe('172.16.0.0')
  expect(infoObj.broadcast.dotNotation()).toBe('172.31.255.255')
})
