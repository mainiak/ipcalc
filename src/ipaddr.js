'use strict'

const IPV4_BYTES = 4

class IPv4 {

  constructor () {
    this.data = new Uint8Array(IPV4_BYTES)
  }

  dotNotation () {
    return `${this.data[0]}.${this.data[1]}.${this.data[2]}.${this.data[3]}`
  }
}

module.exports = IPv4
