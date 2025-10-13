import Encoding from 'encoding-japanese'

// Function để detect encoding và trả về thông tin chi tiết
export function detectEncodingWithInfo(ab: ArrayBuffer): {
  encoding: string
  confidence: 'high' | 'medium' | 'low'
  decodedText?: string
  error?: string
} {
  const bytes = new Uint8Array(ab)

  if (
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf
  ) {
    try {
      const decodedText = new TextDecoder('utf-8').decode(bytes.subarray(3))
      return {
        encoding: 'UTF-8 (BOM)',
        confidence: 'high',
        decodedText,
      }
    } catch (error) {
      return {
        encoding: 'UTF-8 (BOM)',
        confidence: 'low',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Thử các encoding phổ biến
  const encodingsToTry = [
    {
      name: 'UTF-8',
      decoder: () => new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    },
    {
      name: 'Shift-JIS',
      decoder: () =>
        Encoding.convert(bytes, {
          to: 'UNICODE',
          from: 'SJIS',
          type: 'string',
        }) as string,
    },
    {
      name: 'EUC-JP',
      decoder: () =>
        Encoding.convert(bytes, {
          to: 'UNICODE',
          from: 'EUCJP',
          type: 'string',
        }) as string,
    },
    {
      name: 'ISO-8859-1',
      decoder: () => new TextDecoder('iso-8859-1').decode(bytes),
    },
    {
      name: 'Windows-1252',
      decoder: () => new TextDecoder('windows-1252').decode(bytes),
    },
    {
      name: 'ASCII',
      decoder: () => new TextDecoder('ascii').decode(bytes),
    },
  ]

  // Thử tất cả encoding và chọn cái tốt nhất
  let bestResult: {
    encoding: string
    confidence: 'high' | 'medium' | 'low'
    decodedText: string
  } | null = null

  for (const encoding of encodingsToTry) {
    try {
      const decodedText = encoding.decoder()
      const confidence = getDecodingConfidence(decodedText, encoding.name)

      // Nếu là confidence cao nhất, lưu lại
      if (
        !bestResult ||
        (confidence === 'high' && bestResult.confidence !== 'high') ||
        (confidence === 'high' &&
          bestResult.confidence === 'high' &&
          getEncodingPriority(encoding.name) >
            getEncodingPriority(bestResult.encoding)) ||
        (confidence === 'medium' && bestResult.confidence === 'low')
      ) {
        bestResult = {
          encoding: encoding.name,
          confidence,
          decodedText,
        }
      }
    } catch {
      // Tiếp tục thử encoding tiếp theo
      continue
    }
  }

  // Trả về kết quả tốt nhất nếu có
  if (bestResult) {
    return bestResult
  }

  // Nếu tất cả đều fail, thử với encoding-japanese detect
  try {
    const detected = Encoding.detect(bytes)
    if (typeof detected === 'string') {
      const decodedText = Encoding.convert(bytes, {
        to: 'UNICODE',
        from: detected as Encoding.Encoding,
        type: 'string',
      }) as string

      return {
        encoding: detected.toUpperCase(),
        confidence: 'medium',
        decodedText,
      }
    }
  } catch {
    // Ignore
  }

  return {
    encoding: 'UNKNOWN',
    confidence: 'low',
    error: 'Unable to detect or decode the file encoding',
  }
}

// Helper function để xác định độ ưu tiên của encoding
function getEncodingPriority(encoding: string): number {
  // Ưu tiên encoding cụ thể hơn ASCII
  const priorities: Record<string, number> = {
    'ISO-8859-1': 5,
    'Windows-1252': 4,
    'Shift-JIS': 3,
    'EUC-JP': 2,
    'UTF-8': 1,
    ASCII: 0,
  }
  return priorities[encoding] || 0
}

// Helper function để đánh giá chất lượng decode
function getDecodingConfidence(
  text: string,
  encoding: string,
): 'high' | 'medium' | 'low' {
  // Kiểm tra các ký tự không hợp lệ (replacement character)
  const hasInvalidChars = /[\uFFFD]/.test(text)

  if (hasInvalidChars) {
    return 'low'
  }

  // Kiểm tra tỷ lệ ký tự control characters
  const controlCharRatio =
    (text.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g) || [])
      .length / text.length

  if (controlCharRatio > 0.05) {
    return 'low'
  }

  // Đếm các loại ký tự khác nhau
  const japaneseChars = (
    text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []
  ).length

  const latinChars = (text.match(/[\u00C0-\u00FF]/g) || []).length

  const asciiChars = (text.match(/[\x20-\x7E]/g) || []).length

  // Nếu có nhiều ký tự Nhật và encoding là Nhật
  if (japaneseChars > 0 && ['Shift-JIS', 'EUC-JP'].includes(encoding)) {
    return 'high'
  }

  // Nếu có nhiều ký tự Latin và encoding là Latin
  if (latinChars > 0 && ['ISO-8859-1', 'Windows-1252'].includes(encoding)) {
    return 'high'
  }

  // Nếu chủ yếu là ASCII và encoding là ASCII/UTF-8
  if (
    asciiChars > latinChars &&
    asciiChars > japaneseChars &&
    ['UTF-8', 'ASCII'].includes(encoding)
  ) {
    return 'high'
  }

  return 'medium'
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
