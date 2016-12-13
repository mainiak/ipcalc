'use strict'

const BIN_RADIX = 2
const DEC_RADIX = 10
const IPV4_BYTES = 4
const BYTE_BITS = 8
const NETMASK_R = /\/(3[0-2]|[0-2]?[0-9])$/

const IPV4_DIGIT = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|0?[0-9]?[0-9])$/
const IPV4_ADDR = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/

const IPV4LL_START = '169.254.1.0'
const IPV4LL_END = '169.254.254.255'

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
      // clone constructor
      if (arg instanceof IPv4) {
        this.data = arg.data.slice(0)
      }

      if (typeof arg === 'string') {
        if (NETMASK_R.test(arg)) {
          let r = NETMASK_R.exec(arg)
          let num = parseInt(r[1], DEC_RADIX)

          this.data = new Uint8Array(IPV4_BYTES)
          this.data[0] = 128

          if ((num >= 1) && (num <= 31)) {
            let i = 0
            let max = num - 1
            for (i; i < max; i++) {
              // test bit shift between octets first

              let shiftOctet12 = false
              if ((this.data[0] & 1) === 1) {
                shiftOctet12 = true
              }

              let shiftOctet23 = false
              if ((this.data[1] & 1) === 1) {
                shiftOctet23 = true
              }

              let shiftOctet34 = false
              if ((this.data[2] & 1) === 1) {
                shiftOctet34 = true
              }

              // shift all octets
              this.data[0] = this.data[0] >>> 1
              this.data[1] = this.data[1] >>> 1
              this.data[2] = this.data[2] >>> 1
              this.data[3] = this.data[3] >>> 1

              this.data[0] |= 128

              // shift bits betweens octets if needed
              if (shiftOctet12) {
                this.data[1] |= 128
              }

              if (shiftOctet23) {
                this.data[2] |= 128
              }

              if (shiftOctet34) {
                this.data[3] |= 128
              }
            }
          } else {
            throw new Error(`Invalid netmask /${num}`)
          }
        }

        if (this.data === null) {
          throw Error('FIX - String arg')
        }
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

  isNetmask () {
    let bits = this.binNotation().replace(/\./g, '')
    return /^1+0+$/.test(bits)
  }

  isPrivateIP () {
    // in range
  }

  isIPv4LL () {
    if (IPv4.compare(this, IPv4.parse(IPV4LL_START)) === -1) {
      return false
    }

    if (IPv4.compare(this, IPv4.parse(IPV4LL_END)) === 1) {
      return false
    }

    return true
  }

  isInRange (ipAddr1, ipAddr2) {
    if (ipAddr1 instanceof IPv4 === false) {
      throw new Error('First argument is not IPv4 object')
    }

    if (ipAddr2 instanceof IPv4 === false) {
      throw new Error('Second argument is not IPv4 object')
    }

    let range = [ipAddr1, ipAddr2]
    range.sort(IPv4.compare)
    let ipAddrLow = range[0]
    let ipAddrHigh = range[1]

    if (IPv4.compare(this, ipAddrLow) === -1) {
      return false
    }

    if (IPv4.compare(this, ipAddrHigh) === 1) {
      return false
    }

    return true
  }

  binInvert () {
    let ipAddr = new IPv4(this)
    ipAddr.data[0] = ~ipAddr.data[0]
    ipAddr.data[1] = ~ipAddr.data[1]
    ipAddr.data[2] = ~ipAddr.data[2]
    ipAddr.data[3] = ~ipAddr.data[3]
    return ipAddr
  }

  binOr (ipAddr2) {
    let ipAddr1 = new IPv4(this)
    ipAddr1.data[0] |= ipAddr2.data[0]
    ipAddr1.data[1] |= ipAddr2.data[1]
    ipAddr1.data[2] |= ipAddr2.data[2]
    ipAddr1.data[3] |= ipAddr2.data[3]
    return ipAddr1
  }

  binAnd (ipAddr2) {
    let ipAddr1 = new IPv4(this)
    ipAddr1.data[0] &= ipAddr2.data[0]
    ipAddr1.data[1] &= ipAddr2.data[1]
    ipAddr1.data[2] &= ipAddr2.data[2]
    ipAddr1.data[3] &= ipAddr2.data[3]
    return ipAddr1
  }

  static compare (ipAddr1, ipAddr2) {
    if (ipAddr1 instanceof IPv4 === false) {
      throw new Error('First argument is not IPv4 object')
    }

    if (ipAddr2 instanceof IPv4 === false) {
      throw new Error('Second argument is not IPv4 object')
    }

    // octect1 higher or lower?
    if (ipAddr1.data[0] !== ipAddr2.data[0]) {
      if (ipAddr1.data[0] > ipAddr2.data[0]) {
        // console.log(`o1: 1 // ${ipAddr1.data[0]} > ${ipAddr2.data[0]}`) // XXX
        return 1
      } else {
        // console.log(`o1: -1 // ${ipAddr1.data[0]} > ${ipAddr2.data[0]}`) // XXX
        return -1
      }
    }

    // octect2 higher or lower?
    if (ipAddr1.data[1] !== ipAddr2.data[1]) {
      if (ipAddr1.data[1] > ipAddr2.data[1]) {
        // console.log(`o2: 1 // ${ipAddr1.data[1]} > ${ipAddr2.data[1]}`) // XXX
        return 1
      } else {
        // console.log(`o2: -1 // ${ipAddr1.data[1]} > ${ipAddr2.data[1]}`) // XXX
        return -1
      }
    }

    // octect3 higher or lower?
    if (ipAddr1.data[2] !== ipAddr2.data[2]) {
      if (ipAddr1.data[2] > ipAddr2.data[2]) {
        // console.log(`o3: 1 // ${ipAddr1.data[2]} > ${ipAddr2.data[2]}`) // XXX
        return 1
      } else {
        // console.log(`o3: -1 // ${ipAddr1.data[2]} > ${ipAddr2.data[2]}`) // XXX
        return -1
      }
    }

    // octect4 higher or lower?
    if (ipAddr1.data[3] !== ipAddr2.data[3]) {
      if (ipAddr1.data[3] > ipAddr2.data[3]) {
        // console.log(`o4: 1 // ${ipAddr1.data[3]} > ${ipAddr2.data[3]}`) // XXX
        return 1
      } else {
        // console.log(`o4: -1 // ${ipAddr1.data[3]} > ${ipAddr2.data[3]}`) // XXX
        return -1
      }
    }

    // console.log('same octets') // XXX
    return 0
  }

  static info (ipAddr, netmask) {
    if (ipAddr instanceof IPv4 === false) {
      throw new Error('First argument is not IPv4 object')
    }

    if (netmask instanceof IPv4 === false) {
      throw new Error('Second argument is not IPv4 object')
    }

    if (!netmask.isNetmask()) {
      throw new Error('Second argument is not a netmask')
    }

    let invertedNetmask = netmask.binInvert()
    let networkIP = ipAddr.binAnd(netmask)

    return {
      // include copies
      ipAddr: new IPv4(ipAddr),
      netmask: new IPv4(netmask),

      // add
      _invertedNetmask: invertedNetmask,
      networkIP,

      // compute
      broadcast: networkIP.binOr(invertedNetmask)
    }
  }

  static parse (ipAddrStr) {
    if (typeof ipAddrStr !== 'string') {
      throw new Error(`Argument is not a string but ${typeof ipAddrStr}`)
    }

    let ipAddr = null
    let netmask = null

    if (ipAddrStr.indexOf('/') !== -1) {
      if (NETMASK_R.test(ipAddrStr)) {
        let ret = NETMASK_R.exec(ipAddrStr)
        netmask = new IPv4(`/${ret[1]}`)

        // remove netmask from ipAddrStr
        ipAddrStr = ipAddrStr.replace(NETMASK_R, '')
      } else {
        throw new Error('Invalid netmask')
      }
    }

    if (IPV4_ADDR.test(ipAddrStr) === false) {
      throw new Error('Invalid format')
    }

    let i = 0
    const max = 4
    let octets = ipAddrStr.split('.')

    for (i; i < max; i++) {
      if (IPV4_DIGIT.test(octets[i]) === false) {
        throw new Error(`Invalid ${(i + 1)}. octet`)
      } else {
        octets[i] = parseInt(octets[i], DEC_RADIX)
      }
    }

    ipAddr = new IPv4(octets)

    if (netmask === null) {
      return ipAddr
    }

    return {
      ipAddr,
      netmask
    }
  }
}

module.exports = IPv4
