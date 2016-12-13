/* global describe,it,xit,expect */
'use strict'

const path = require('path')
const IPv4 = require(path.join('..', 'src', 'ipaddr.js'))

describe('IPv4 constructor', () => {
  it('Empty constructor', () => {
    let ipAddr = new IPv4()
    expect(ipAddr.dotNotation()).toBe('0.0.0.0')
    expect(ipAddr.binNotation()).toBe('00000000.00000000.00000000.00000000')
  })

  it('Array constructor - [1,2,3,4]', () => {
    let ipAddr = new IPv4([1, 2, 3, 4])
    expect(ipAddr.dotNotation()).toBe('1.2.3.4')
  })

  it('Clone constructor', () => {
    let ipAddr1 = new IPv4([1, 2, 3, 4])
    let ipAddr2 = new IPv4(ipAddr1)
    expect(ipAddr1).not.toBe(ipAddr2)
    expect(ipAddr1.dotNotation()).toBe(ipAddr2.dotNotation())
  })

  it('Invalid constructor', () => {
    expect(() => {
      return new IPv4(1234)
    }).toThrowError('Invalid type: number')
  })

  describe('String constructor', () => {
    it('Invalid string constructor', () => {
      expect(() => {
        return new IPv4('bla bla')
      }).toThrowError('FIX - String arg') // FIXME
    })

    // FIXME
    xit('Dot notation - 1.2.3.4', () => {
      let ipAddr = new IPv4('1.2.3.4')
      expect(ipAddr.binNotation()).toBe('11111111.11110000.00000000.00000000')
    })

    describe('Netmask - /N', () => {
      it('Bellow lower range /0', () => {
        expect(() => {
          return new IPv4('/0')
        }).toThrowError('Invalid netmask /0')
      })

      it('Lower border case /1', () => {
        let ipAddr = new IPv4('/1')
        expect(ipAddr.binNotation()).toBe('10000000.00000000.00000000.00000000')
      })

      it('Lower border case /2', () => {
        let ipAddr = new IPv4('/2')
        expect(ipAddr.binNotation()).toBe('11000000.00000000.00000000.00000000')
      })

      it('String netmask constructor /12', () => {
        let ipAddr = new IPv4('/12')
        expect(ipAddr.binNotation()).toBe('11111111.11110000.00000000.00000000')
      })

      it('Higher border case /31', () => {
        let ipAddr = new IPv4('/31')
        expect(ipAddr.binNotation()).toBe('11111111.11111111.11111111.11111110')
      })

      it('Above higher range /32', () => {
        expect(() => {
          return new IPv4('/32')
        }).toThrowError('Invalid netmask /32')
      })
    })
  })
})

describe('IPv4 instance method', () => {
  describe('isNetmask()', () => {
    it('Not a netmask', () => {
      let ipAddr = new IPv4([192, 168, 1, 2])
      expect(ipAddr.isNetmask()).toBe(false)
    })

    it('/8', () => {
      let ipAddr = new IPv4([255, 0, 0, 0])
      expect(ipAddr.isNetmask()).toBe(true)
    })

    it('/16', () => {
      let ipAddr = new IPv4([255, 255, 0, 0])
      expect(ipAddr.isNetmask()).toBe(true)
    })

    it('/24', () => {
      let ipAddr = new IPv4([255, 255, 255, 0])
      expect(ipAddr.isNetmask()).toBe(true)
    })
  })

  describe('isInRange()', () => {
    it('Invalid 1st argument', () => {
      let ipAddr = new IPv4([192, 168, 1, 2])
      expect(() => {
        ipAddr.isInRange()
      }).toThrowError('First argument is not IPv4 object')
    })

    it('Invalid 2nd argument', () => {
      let ipAddr = new IPv4([192, 168, 1, 2])
      let ipAddrLow = new IPv4([192, 168, 0, 0])
      expect(() => {
        ipAddr.isInRange(ipAddrLow)
      }).toThrowError('Second argument is not IPv4 object')
    })

    it('Lower border', () => {
      let ipAddrLow = new IPv4([192, 168, 0, 0])
      let ipAddrHigh = new IPv4([192, 168, 255, 255])
      expect(ipAddrLow.isInRange(ipAddrLow, ipAddrHigh)).toBe(true)
    })

    it('Higher border', () => {
      let ipAddrLow = new IPv4([192, 168, 0, 0])
      let ipAddrHigh = new IPv4([192, 168, 255, 255])
      expect(ipAddrHigh.isInRange(ipAddrLow, ipAddrHigh)).toBe(true)
    })

    it('In range', () => {
      let ipAddr = new IPv4([192, 168, 1, 2])
      let ipAddrLow = new IPv4([192, 168, 0, 0])
      let ipAddrHigh = new IPv4([192, 168, 255, 255])
      expect(ipAddr.isInRange(ipAddrLow, ipAddrHigh)).toBe(true)
    })

    it('In range & swap order', () => {
      let ipAddr = new IPv4([192, 168, 1, 2])
      let ipAddrLow = new IPv4([192, 168, 0, 0])
      let ipAddrHigh = new IPv4([192, 168, 255, 255])
      expect(ipAddr.isInRange(ipAddrHigh, ipAddrLow)).toBe(true)
    })

    it('Bellow range', () => {
      let ipAddr = new IPv4([10, 10, 1, 2])
      let ipAddrLow = new IPv4([192, 168, 0, 0])
      let ipAddrHigh = new IPv4([192, 168, 255, 255])
      expect(ipAddr.isInRange(ipAddrLow, ipAddrHigh)).toBe(false)
    })

    it('Above range', () => {
      let ipAddr = new IPv4([200, 200, 1, 2])
      let ipAddrLow = new IPv4([192, 168, 0, 0])
      let ipAddrHigh = new IPv4([192, 168, 255, 255])
      expect(ipAddr.isInRange(ipAddrLow, ipAddrHigh)).toBe(false)
    })
  })

  describe('isIPv4LL()', () => {
    it('Bellow range', () => {
      let ipAddr = new IPv4([10, 10, 10, 10])
      expect(ipAddr.isIPv4LL()).toBe(false)
    })

    it('In range', () => {
      let ipAddr = new IPv4([169, 254, 10, 10])
      expect(ipAddr.isIPv4LL()).toBe(true)
    })

    it('Above range', () => {
      let ipAddr = new IPv4([172, 10, 10, 10])
      expect(ipAddr.isIPv4LL()).toBe(false)
    })
  })
})

describe('IPv4 static method', () => {
  describe('IPv4.compare()', () => {
    it('Invalid 1st argument', () => {
      expect(() => {
        IPv4.compare()
      }).toThrowError('First argument is not IPv4 object')
    })

    it('Invalid 2nd argument', () => {
      let ipAddr1 = new IPv4()
      expect(() => {
        IPv4.compare(ipAddr1)
      }).toThrowError('Second argument is not IPv4 object')
    })

    it('equal', () => {
      let ipAddr1 = new IPv4()
      let ipAddr2 = new IPv4()
      expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(0)
    })

    it('octet 1 higher', () => {
      let ipAddr1 = new IPv4([1, 0, 0, 0])
      let ipAddr2 = new IPv4([0, 0, 0, 0])
      expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(1)
    })

    it('octet 1 lower', () => {
      let ipAddr1 = new IPv4([0, 0, 0, 0])
      let ipAddr2 = new IPv4([1, 0, 0, 0])
      expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(-1)
    })

    it('octet 2 higher', () => {
      let ipAddr1 = new IPv4([0, 1, 0, 0])
      let ipAddr2 = new IPv4([0, 0, 0, 0])
      expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(1)
    })

    it('octet 2 lower', () => {
      let ipAddr1 = new IPv4([0, 0, 0, 0])
      let ipAddr2 = new IPv4([0, 1, 0, 0])
      expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(-1)
    })

    it('octet 3 higher', () => {
      let ipAddr1 = new IPv4([0, 0, 1, 0])
      let ipAddr2 = new IPv4([0, 0, 0, 0])
      expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(1)
    })

    it('octet 3 lower', () => {
      let ipAddr1 = new IPv4([0, 0, 0, 0])
      let ipAddr2 = new IPv4([0, 0, 1, 0])
      expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(-1)
    })

    it('octet 4 higher', () => {
      let ipAddr1 = new IPv4([0, 0, 0, 1])
      let ipAddr2 = new IPv4([0, 0, 0, 0])
      expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(1)
    })

    it('octet 4 lower', () => {
      let ipAddr1 = new IPv4([0, 0, 0, 0])
      let ipAddr2 = new IPv4([0, 0, 0, 1])
      expect(IPv4.compare(ipAddr1, ipAddr2)).toBe(-1)
    })
  })

  describe('IPv4.info()', () => {
    it('Invalid 1st argument', () => {
      expect(() => {
        IPv4.info()
      }).toThrowError('First argument is not IPv4 object')
    })

    it('Invalid 2nd argument', () => {
      let ipAddr1 = new IPv4([1, 2, 3, 4])
      expect(() => {
        IPv4.info(ipAddr1)
      }).toThrowError('Second argument is not IPv4 object')
    })

    it('2nd argument is not a netmask', () => {
      let ipAddr1 = new IPv4([1, 2, 3, 4])
      let ipAddr2 = new IPv4([1, 2, 3, 4])
      expect(() => {
        IPv4.info(ipAddr1, ipAddr2)
      }).toThrowError('Second argument is not a netmask')
    })

    it('Returns object', () => {
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
  })
})
