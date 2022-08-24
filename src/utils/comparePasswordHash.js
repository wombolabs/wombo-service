const { createHash } = require('node:crypto')

const itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

// PHP JavaScript ported function
const ord = (string) => {
  //  discuss at: https://locutus.io/php/ord/
  // original by: Kevin van Zonneveld (https://kvz.io)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // improved by: Brett Zamir (https://brett-zamir.me)
  //    input by: incidence
  //   example 1: ord('K')
  //   returns 1: 75
  //   example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
  //   returns 2: 65536
  const str = `${string}`
  const code = str.charCodeAt(0)
  if (code >= 0xd800 && code <= 0xdbff) {
    // High surrogate (could change last hex to 0xDB7F to treat
    // high private surrogates as single characters)
    const hi = code
    if (str.length === 1) {
      // This is just a high surrogate with no following low surrogate,
      // so we return its value;
      return code
      // we could also throw an error as it is not a complete character,
      // but someone may want to know
    }
    const low = str.charCodeAt(1)
    return (hi - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000
  }
  if (code >= 0xdc00 && code <= 0xdfff) {
    // Low surrogate
    // This is just a low surrogate with no preceding high surrogate,
    // so we return its value;
    return code
    // we could also throw an error as it is not a complete character,
    // but someone may want to know
  }
  return code
}

const encode64 = (input, count) => {
  let output = ''
  let i = 0
  let value
  let v

  do {
    value = ord(input.charAt(i++))
    v = value & 0x3f
    output = `${output}${itoa64.charAt(v)}`
    if (i < count) {
      value |= ord(input.charAt(i)) << 8
    }
    v = (value >> 6) & 0x3f
    output = `${output}${itoa64.charAt(v)}`
    if (i++ >= count) {
      break
    }
    if (i < count) {
      value |= ord(input.charAt(i)) << 16
    }
    v = (value >> 12) & 0x3f
    output = `${output}${itoa64.charAt(v)}`
    if (i++ >= count) {
      break
    }
    v = (value >> 18) & 0x3f
    output = `${output}${itoa64.charAt(v)}`
  } while (i < count)

  return output
}

export const comparePasswordHash = (password, storedPasswordHash) => {
  if (password.length > 4096) {
    return false
  }

  let count = 8192 // 1 << 13 -> position 13 of B - itoa64

  const salt = storedPasswordHash.substr(4, 8)

  let hash = createHash('md5').update(`${salt}${password}`, 'binary').digest('binary')
  do {
    hash = createHash('md5').update(`${hash}${password}`, 'binary').digest('binary')
  } while (--count)
  let output = storedPasswordHash.substr(0, 12)
  output = `${output}${encode64(hash, 16)}`

  return output === storedPasswordHash
}
