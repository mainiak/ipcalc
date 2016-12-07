'use strict'

const BIN_RADIX = 2
const IPV4_BYTES = 4
const BYTE_BITS = 8

function pad (binNum, digits) {
  let i = 0
  let prefix = ''
  let zeroCount = digits - binNum.length
  for (i; i < zeroCount; i++) {
    prefix += '0'
  }
  return (prefix + binNum)
}

class IPv4 {

  constructor (arg) {
    this.data = null

    if (arg) {
      if (typeof arg === 'string') {
        throw Error('FIX - String arg')
      }

      if (Array.isArray(arg)) {
        // TODO: add array checks
        this.data = Uint8Array.from(arg)
      }

      if (this.data === null) {
        throw Error(`Invalid type: ${typeof arg}`)
      }
    } else {
      this.data = new Uint8Array(IPV4_BYTES)
    }
  }

  dotNotation () {
    return `${this.data[0]}.${this.data[1]}.${this.data[2]}.${this.data[3]}`
  }

  binNotation () {
    let i
    let ret = ''
    for (i = 0; i < IPV4_BYTES; i++) {
      ret += pad(this.data[i].toString(BIN_RADIX), BYTE_BITS)
      if (i < (IPV4_BYTES - 1)) {
        ret += '.'
      }
    }
    return ret
  }
}

module.exports = IPv4
