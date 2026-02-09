import dayjs from 'dayjs'

const useDate = () => {
  const convertDate = (
    date?: string | Date | number | undefined | null,
    format = 'YYYY/MM/DD',
  ) => {
    if (!date) return '-'
    const d = dayjs(date)
    return d.isValid() ? d.format(format) : '-'
  }

  return { convertDate }
}

export default useDate
