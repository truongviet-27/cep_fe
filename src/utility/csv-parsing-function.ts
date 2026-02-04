export function parseHoujinCsv(csvString: string) {
  const lines = csvString
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length === 0) {
    return {
      lastUpdateDate: '',
      count: 0,
      divideNumber: 0,
      divideSize: 0,
      corporations: [],
    }
  }

  const headerLine = lines[0]
  const headerValues = parseCsvLine(headerLine)
  const metadata = {
    lastUpdateDate: headerValues[0] || '',
    count: parseInt(headerValues[1] || '0', 10),
    divideNumber: parseInt(headerValues[2] || '0', 10),
    divideSize: parseInt(headerValues[3] || '0', 10),
  }

  // Parse các dòng còn lại (corporation records)
  const corporationKeys = [
    'corporateNumber',
    'process',
    'correct',
    'updateDate',
    'changeDate',
    'name',
    'nameImageId',
    'kind',
    'prefectureName',
    'cityName',
    'streetNumber',
    'addressImageId',
    'prefectureCode',
    'cityCode',
    'townCode',
    'hihyoji',
    'furigana',
    'enName',
    'enPrefectureName',
    'enCityName',
    'enAddressLine',
    'enAddressImageId',
    'furigana',
    'businessSummary',
    'closeDate',
    'closeCause',
    'successorCorporateNumber',
    'changeCause',
    'assignmentDate',
    'latest',
    'enName',
    'enPrefectureName',
    'enAddress',
    'enAddressOutside',
    'corporateNameFurigana',
  ]

  const corporations = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const values = parseCsvLine(line)

    const recordData = values.slice(1)

    if (recordData.length === 0 || !recordData[0]) {
      continue
    }

    const corporationObject: { [key: string]: string | number } = {}
    corporationKeys.forEach((key, index) => {
      corporationObject[key] = recordData[index] || ''
    })
    corporations.push(corporationObject)
  }

  return {
    ...metadata,
    corporations,
  }
}

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  values.push(current.trim())

  return values.map((value) => value.replace(/^"|"$/g, ''))
}
