'use strict'

const DEC_RADIX = 10

function divide (num) {
  let r = num % 2
  let q = (num - r) / 2
  return {
    r, q
  }
}

exports.num2bin = function (num) {
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

