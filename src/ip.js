'use strict'

const path = require('path')
const calc = require(path.join(__dirname, 'calc.js'))

const IPV4_DIGIT = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|0?[0-9]?[0-9])$/
const IPV4_ADDR = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/
const NETMASK = /\/(3[0-2]|[0-2]?[0-9])$/

// https://en.wikipedia.org/wiki/Private_network
const PRIVATE_NETWORKS = [
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16'
]

const IPV4LL_START = '169.254.1.0'
const IPV4LL_END = '169.254.254.255'

function pad8 (bin_num) {
  let i = 0
  let prefix = ''
  let zero_count = 8 - bin_num.length
  for (i; i < zero_count; i++) {
    prefix += '0'
  }
  return (prefix + bin_num)
}

function ip2bin (ip_addr) {
  let i = 0
  const max = 4
  let octets = ip_addr.split('.')
  for (i; i < max; i++) {
    octets[i] = pad8(calc.dec2bin(octets[i]))
  }
  return octets.join('')
}

function isIPv4LL (ip_addr) {
  let start_ip = ip2bin(IPV4LL_START)
  let end_ip = ip2bin(IPV4LL_END)
  let test_ip = ip2bin(ip_addr)
  return ((test_ip >= start_ip) && (test_ip <= end_ip))
}

function validate (ip_addr) {
  if (typeof ip_addr !== 'string') {
    return 'Not a string'
  }

  if (ip_addr.indexOf('/') !== -1) {
    if (NETMASK.test(ip_addr)) {
      ip_addr = ip_addr.replace(NETMASK, '')
    } else {
      return 'Invalid netmask'
    }
  }

  if (IPV4_ADDR.test(ip_addr) === false) {
    return 'Invalid format'
  }

  let i = 0
  const max = 4
  let octets = ip_addr.split('.')

  for (i; i < max; i++) {
    if (IPV4_DIGIT.test(octets[i]) === false) {
      return `Invalid ${(i + 1)}. octet`
    }
  }

  return 'OK'
}

module.exports = {
  validate,
  isIPv4LL,
  IPV4LL_END,
  IPV4LL_START,
  PRIVATE_NETWORKS
}
