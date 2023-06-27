import { join } from 'path';
import * as PDFDocument from 'pdfkit';

export const generateCertificate = (image: Buffer, user: string) => {
  const fontPath = join(__dirname, '/fonts/roboto/Roboto-Regular.ttf');

  const doc = new PDFDocument({
    lang: 'PL',
    pdfVersion: '1.7',
    compress: true,
    autoFirstPage: false,
  });

  doc.registerFont('Roboto', fontPath);

  const i = doc.openImage(image);
  doc.addPage({ size: [i.width, i.height], margin: 0 });
  doc
    .image(image)
    .fillColor('#FDEFEA')
    .fontSize(92)
    .font('Roboto')
    .text(user, 0, 2700, {
      align: 'center',
    });

  return new Promise((resolve) => {
    const buffers = [];
    let pdfData;
    doc.on('data', (d) => {
      buffers.push(d);
    });
    doc.on('end', () => {
      pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.end();
  });
};
