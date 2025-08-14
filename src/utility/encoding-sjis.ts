import Encoding from 'encoding-japanese'

export function robustDecode(
  ab: ArrayBuffer,
  hint: 'utf-8' | 'shift_jis',
): string {
  const bytes = new Uint8Array(ab)

  if (
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf
  ) {
    return new TextDecoder('utf-8').decode(bytes.subarray(3))
  }

  const decodeUTF8 = () =>
    new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  const decodeSJIS = () =>
    Encoding.convert(bytes, {
      to: 'UNICODE',
      from: 'SJIS',
      type: 'string',
    }) as string

  if (hint === 'shift_jis' && isValidUtf8(bytes)) {
    try {
      return decodeUTF8()
    } catch {}
  }

  if (hint === 'utf-8') {
    try {
      return decodeUTF8()
    } catch {
      return decodeSJIS()
    }
  } else {
    try {
      return decodeSJIS()
    } catch {
      return decodeUTF8()
    }
  }
}

function isValidUtf8(bytes: Uint8Array): boolean {
  let i = 0
  while (i < bytes.length) {
    const b = bytes[i]
    if ((b & 0x80) === 0) {
      i++
      continue
    }
    if ((b & 0xe0) === 0xc0) {
      if (i + 1 >= bytes.length) return false
      const b1 = bytes[i + 1]
      if ((b1 & 0xc0) !== 0x80) return false
      const cp = ((b & 0x1f) << 6) | (b1 & 0x3f)
      if (cp < 0x80) return false
      i += 2
      continue
    }
    if ((b & 0xf0) === 0xe0) {
      if (i + 2 >= bytes.length) return false
      const b1 = bytes[i + 1],
        b2 = bytes[i + 2]
      if ((b1 & 0xc0) !== 0x80 || (b2 & 0xc0) !== 0x80) return false
      const cp = ((b & 0x0f) << 12) | ((b1 & 0x3f) << 6) | (b2 & 0x3f)
      if (cp < 0x800) return false
      if (cp >= 0xd800 && cp <= 0xdfff) return false
      i += 3
      continue
    }
    if ((b & 0xf8) === 0xf0) {
      if (i + 3 >= bytes.length) return false
      const b1 = bytes[i + 1],
        b2 = bytes[i + 2],
        b3 = bytes[i + 3]
      if ((b1 & 0xc0) !== 0x80 || (b2 & 0xc0) !== 0x80 || (b3 & 0xc0) !== 0x80)
        return false
      const cp =
        ((b & 0x07) << 18) |
        ((b1 & 0x3f) << 12) |
        ((b2 & 0x3f) << 6) |
        (b3 & 0x3f)
      if (cp < 0x10000 || cp > 0x10ffff) return false
      i += 4
      continue
    }
    return false
  }
  return true
}
