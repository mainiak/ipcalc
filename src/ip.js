'use strict'

const IPV4_DIGIT = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|0?[0-9]?[0-9])$/
const IPV4_ADDR = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/
const NETMASK = /\/(3[0-2]|[0-2]?[0-9])$/

exports.validate = function (ip_addr) {
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
  let max = 4
  let octets = ip_addr.split('.')

  for (i; i < max; i++) {
    if (IPV4_DIGIT.test(octets[i]) === false) {
      return `Invalid ${(i + 1)}. octet`
    }
  }

  return 'OK'
}
