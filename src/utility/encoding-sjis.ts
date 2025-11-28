import Encoding from 'encoding-japanese'

export function detectEncodingWithInfo(ab: ArrayBuffer) {
  const bytes = new Uint8Array(ab)

  // =============================
  // 1) Detect UTF-16 BOM
  // =============================
  if (bytes.length >= 2) {
    const bom = (bytes[0] << 8) | bytes[1]

    if (bom === 0xfeff) {
      return {
        encoding: 'UTF-16BE',
        confidence: 'high',
        decodedText: new TextDecoder('utf-16be').decode(bytes),
      }
    }

    if (bom === 0xfffe) {
      return {
        encoding: 'UTF-16LE',
        confidence: 'high',
        decodedText: new TextDecoder('utf-16le').decode(bytes),
      }
    }
  }

  // =============================
  // 2) UTF-8 BOM
  // =============================
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf
  ) {
    return {
      encoding: 'UTF-8',
      confidence: 'high',
      decodedText: new TextDecoder('utf-8').decode(bytes.subarray(3)),
    }
  }

  // =============================
  // 3) ASCII CHECK (before check UTF-8)
  // =============================
  if (isAscii(bytes)) {
    return {
      encoding: 'ASCII',
      confidence: 'high',
      decodedText: new TextDecoder('ascii').decode(bytes),
    }
  }

  // =============================
  // 4) Check UTF-8 validity
  // =============================
  if (isValidUtf8(bytes)) {
    return {
      encoding: 'UTF-8',
      confidence: 'high',
      decodedText: new TextDecoder('utf-8').decode(bytes),
    }
  }

  // =============================
  // 5) Try Japanese encodings
  // =============================
  try {
    const sjis = Encoding.convert(bytes, {
      to: 'UNICODE',
      from: 'SJIS',
      type: 'string',
    }) as string

    if (!containsInvalidChars(sjis)) {
      return { encoding: 'Shift-JIS', confidence: 'medium', decodedText: sjis }
    }
  } catch {}

  try {
    const euc = Encoding.convert(bytes, {
      to: 'UNICODE',
      from: 'EUCJP',
      type: 'string',
    }) as string

    if (!containsInvalidChars(euc)) {
      return { encoding: 'EUC-JP', confidence: 'medium', decodedText: euc }
    }
  } catch {}

  // =============================
  // 6) Latin fallback
  // =============================
  try {
    const latin = new TextDecoder('iso-8859-1').decode(bytes)
    return { encoding: 'ISO-8859-1', confidence: 'low', decodedText: latin }
  } catch {}

  // =============================
  // 7) Unknown
  // =============================
  return {
    encoding: 'UNKNOWN',
    confidence: 'low',
    error: 'Unable to detect encoding',
  }
}

// ================
// Helper functions
// ================

function isAscii(bytes: Uint8Array) {
  return bytes.every((b) => b <= 0x7f)
}

function containsInvalidChars(text: string) {
  return text.includes('\uFFFD')
}

function isValidUtf8(bytes: Uint8Array): boolean {
  let i = 0
  while (i < bytes.length) {
    const b = bytes[i]

    if (b <= 0x7f) {
      i++
      continue
    }

    if (b >= 0xc2 && b <= 0xdf) {
      if (i + 1 >= bytes.length) return false
      const b1 = bytes[i + 1]
      if ((b1 & 0xc0) !== 0x80) return false
      i += 2
      continue
    }

    if (b >= 0xe0 && b <= 0xef) {
      if (i + 2 >= bytes.length) return false
      const b1 = bytes[i + 1],
        b2 = bytes[i + 2]
      if ((b1 & 0xc0) !== 0x80 || (b2 & 0xc0) !== 0x80) return false
      if (b === 0xed && (b1 & 0xe0) === 0xa0) return false
      i += 3
      continue
    }

    if (b >= 0xf0 && b <= 0xf4) {
      if (i + 3 >= bytes.length) return false
      const b1 = bytes[i + 1],
        b2 = bytes[i + 2],
        b3 = bytes[i + 3]
      if ((b1 & 0xc0) !== 0x80 || (b2 & 0xc0) !== 0x80 || (b3 & 0xc0) !== 0x80)
        return false
      i += 4
      continue
    }

    return false
  }
  return true
}

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
