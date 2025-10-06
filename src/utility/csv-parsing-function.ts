export function parseHoujinCsv(csvString: string) {
  const values = csvString
    .split(',')
    .map((value) => value.replace(/^"|"$/g, ''))

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

  const metadata = {
    lastUpdateDate: values[0],
    count: parseInt(values[1], 10),
    divideNumber: parseInt(values[2], 10),
    divideSize: parseInt(values[3], 10),
  }

  const corporations = []
  const recordData = values.slice(4)
  const recordSize = 35

  for (let i = 0; i < recordData.length; i += recordSize) {
    const chunk = recordData.slice(i, i + recordSize)
    if (chunk.length < recordSize || !chunk[0]) {
      continue
    }

    const corporationObject: { [key: string]: string | number } = {}
    corporationKeys.forEach((key, index) => {
      corporationObject[key] = chunk[index]
    })
    corporations.push(corporationObject)
  }

  return {
    ...metadata,
    corporations,
  }
}
