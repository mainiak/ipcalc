'use strict'

const BIN_RADIX = 2
const DEC_RADIX = 10

function divide (num) {
  let r = num % 2
  let q = (num - r) / 2
  return {
    r, q
  }
}

exports.dec2bin = function (num) {
  if ((typeof num === 'string') && (/^\d+$/.test(num))) {
    num = parseInt(num, DEC_RADIX)
  }

  if (typeof num !== 'number') {
    throw new Error('Not a number: ' + num)
  }

  let bin_num = ''
  let div_num = num
  let run = true

  while (run) {
    let {q, r} = divide(div_num)
    div_num = q
    bin_num = r + bin_num
    if (q === 0) {
      run = false
    }
  }

  return bin_num
}

exports.bin2dec = function (bin) {
  if ((typeof bin === 'string') && (/^[01]+$/.test(bin))) {
    return parseInt(bin, BIN_RADIX)
  }

  throw new Error('Not a binary number: ' + bin)
}
