/* eslint-disable simple-import-sort/imports */
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

function PreviewPdf({ htmlString }: { htmlString: string }) {
  const prepared = htmlString
    .replace(/<!doctype[^>]*>/i, '')
    .replace(/\n/g, '')
    .replace(/\\"/g, '"')

  const bodyMatch = prepared.match(/<body[^>]*>([\s\S]*?)<\/body>/i)

  const bodyContent = bodyMatch ? DOMPurify.sanitize(bodyMatch[1]) : prepared

  return <>{parse(bodyContent)}</>
}

export default PreviewPdf
