import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { v4 as uuid } from 'uuid';

const fs = require('fs')
const path = require('path')


export async function modifyPdf(fileName: string, username: string) {
  // Text
  const brandText = 'EXAM CENTRAL'
  const nameText = `By ${username}`

  const originalPdf = await readFileFromLocal(fileName)

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(originalPdf)

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Get the first page of the document
  const pages = pdfDoc.getPages()
  pages.forEach(page => {

    // Get the width and height of the first page
    const { width, height } = page.getSize()

    // Draw a string of text diagonally across the first page
    let textSize = 50
    let textWidth = helveticaFont.widthOfTextAtSize(brandText, textSize)
    page.drawText(brandText, {
      x: width - textWidth,
      y: Math.sqrt(3) * (width - textWidth / 2) / 2 - textSize,
      size: textSize,
      font: helveticaFont,
      color: rgb(0.160, 0.160, 0.160),
      opacity: 0.2,
      rotate: degrees(55),
    })

    // adding NAME
    textWidth = helveticaFont.widthOfTextAtSize(nameText, textSize)
    page.drawText(nameText, {
      x: width - textWidth - textSize / 2,
      y: Math.sqrt(3) * (width - textWidth / 2) / 2 - 2 * textSize,
      size: textSize,
      font: helveticaFont,
      color: rgb(0.160, 0.160, 0.160),
      opacity: 0.2,
      rotate: degrees(55),
    })

    // Draw a string of text diagonally in top left block
    // brandText
    textSize = 30
    textWidth = helveticaFont.widthOfTextAtSize(brandText, textSize)
    page.drawText(brandText, {
      x: (width - textWidth) / 3,
      y: (Math.sqrt(3) * (width - textWidth / 2) / 2 - textSize) * 1.5,
      size: textSize,
      font: helveticaFont,
      color: rgb(0.160, 0.160, 0.160),
      opacity: 0.2,
      rotate: degrees(55),
    })

    // nameText
    textWidth = helveticaFont.widthOfTextAtSize(nameText, textSize)
    page.drawText(nameText, {
      x: (width - textWidth + textSize) / 3,
      y: (Math.sqrt(3) * (width - textWidth / 2) / 2 - 2 * textSize) * 1.5,
      size: textSize,
      font: helveticaFont,
      color: rgb(0.160, 0.160, 0.160),
      opacity: 0.2,
      rotate: degrees(55),
    })

    // Draw a string of text diagonally in bottom right block
    // brandText
    textSize = 30
    textWidth = helveticaFont.widthOfTextAtSize(brandText, textSize)
    page.drawText(brandText, {
      x: width - textWidth - textSize / 2,
      y: (Math.sqrt(3) * (width - textWidth / 2) / 2 - textSize) / 4,
      size: textSize,
      font: helveticaFont,
      color: rgb(0.160, 0.160, 0.160),
      opacity: 0.2,
      rotate: degrees(55),
    })

    // nameText
    textWidth = helveticaFont.widthOfTextAtSize(nameText, textSize)
    page.drawText(nameText, {
      x: width - textWidth - textSize,
      y: (Math.sqrt(3) * (width - textWidth / 2) / 2 - 2 * textSize) / 4,
      size: textSize,
      font: helveticaFont,
      color: rgb(0.160, 0.160, 0.160),
      opacity: 0.2,
      rotate: degrees(55),
    })

  })

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()

  // For example, `pdfBytes` can be:
  //   • Written to a file in Node
  //   • Downloaded from the browser
  //   • Rendered in an <iframe>

  return await writeFileToLocal(pdfBytes)

  // return {
  //     filename,
  //     filesize
  // }

}

export async function readFileFromLocal(filename: string) {
  const filepath = path.join(process.cwd(), 'public/files', filename)
  return fs.readFileSync(filepath)
}

export async function writeFileToLocal(pdfBytes: Uint8Array) {
  const filename = `modify-${uuid()}.pdf`
  const filepath = path.join(process.cwd(), 'public/files', filename)
  fs.writeFileSync(filepath, pdfBytes)

  const filesize = fs.statSync(filepath).size

  return {
    filename,
    filesize
  }
}
