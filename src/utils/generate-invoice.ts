import path from 'path';
import { join } from 'path';
import * as PDFDocument from 'pdfkit';

import { Order } from '../schemas/order.schema';
import { formatPrice } from './formatPrice';

const GenerateInvoice = (
  dataCallback: (chunk: any) => any,
  endCallback: () => any,
  order: Order,
) => {
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
    font: join(__dirname, '/fonts/roboto/Roboto-Regular.ttf'),
  });

  doc.registerFont(
    'RobotoRegular',
    join(__dirname, '/fonts/roboto/Roboto-Regular.ttf'),
    '',
  );

  doc.registerFont(
    'RobotoBold',
    join(__dirname, '/fonts/roboto/Roboto-Bold.ttf'),
    '',
  );

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  generateHeader(doc);
  generateCustomerInformation(doc, order);
  generateTable(doc, order);

  doc.end();
};

const generateHeader = (doc: PDFKit.PDFDocument) => {
  return (
    doc
      // .image("logo.png", 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(20)
      .font('RobotoBold')
      .text('ACME Inc.', 50, 50)
      .font('RobotoRegular')
      .fontSize(10)
      .text('ACME Inc.', 185, 50, { align: 'right' })
      .text('123 Main Street', 185, 65, { align: 'right' })
      .text('New York, NY, 10025', 185, 80, { align: 'right' })
      .moveDown()
  );
};

const generateCustomerInformation = (doc: PDFKit.PDFDocument, order: Order) => {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .font('RobotoBold')
    .text('FAKTURA 1/12/2022', 50, 155);

  generateLine(doc, 185);

  const customerInformationTop = 200;
  const billing = order.billing;

  doc
    .fontSize(10)
    .font('RobotoBold')
    .text('Numer zamówienia:', 50, customerInformationTop)
    .font('RobotoRegular')
    .text(order.orderId, 150, customerInformationTop)
    .font('RobotoBold')
    .text('Data zamówienia:', 50, customerInformationTop + 15)
    .font('RobotoRegular')
    .text(
      new Date(order.createdAt).toLocaleDateString('pl-PL'),
      150,
      customerInformationTop + 15,
    )
    // CUSTOMER
    .font('RobotoBold')
    .text(
      billing.isCompany
        ? billing.companyName
        : `${billing.firstName} ${billing.lastName}`,
      300,
      customerInformationTop,
    )
    .font('RobotoRegular')
    .text(
      billing.isCompany ? billing.companyStreet : billing.street,
      300,
      customerInformationTop + 15,
    )
    .text(
      `${billing.companyPostCode} ${billing.companyCity},`,
      300,
      customerInformationTop + 30,
    )
    .text(billing.companyCountry, 300, customerInformationTop + 45)
    .moveDown();

  generateLine(doc, 270);
};

const generateTable = (doc: PDFKit.PDFDocument, order: Order) => {
  const invoiceTableTop = 300;
  doc.font('RobotoBold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Lp.',
    'Nazwa towaru lub usługi',
    'Ilość',
    'Wartość netto',
    'VAT',
    'Wartość VAT',
    'Wartość brutto',
    true,
  );
  generateLine(doc, invoiceTableTop + 30);

  const limit = 10;

  let currentPosition = 0;
  let currentPage = 1;
  let currentIndex = 0;

  const arr = Array.from(Array(100).keys());

  order.orderItems.map((item, idx, array) => {
    const getPosition = invoiceTableTop + (currentPosition + 1) * 30;
    currentIndex = idx;

    generateTableRow(
      doc,
      getPosition,
      (idx + 1).toString(),
      item.product.name,
      '1',
      formatPrice(item.price),
      `${order.tax_rate}%`,
      formatPrice(item.tax),
      formatPrice(item.price + item.tax),
    );

    generateLine(doc, getPosition + 30);

    currentPosition += 1;

    const pages = array.length / limit;

    if (currentPosition % limit === 0 && currentPage < pages) {
      currentPosition = 0;
      currentPage += 1;
      doc.addPage();
    }
  });

  generateTableSummary(doc, invoiceTableTop + (currentPosition + 1) * 30);
};

const generateTableRow = (
  doc: PDFKit.PDFDocument,
  y: number,
  number: string,
  name: string,
  quantity: string,
  net_value: string,
  tax_rate: string,
  tax_value: string,
  gross_value: string,
  withBg?: boolean,
) => {
  const yPost = y + 9;

  if (withBg) {
    // BACKGROUND
    doc.rect(50, y, 496, 30).fill('#edeef0');

    // COLUMNS
    // LP
    doc.rect(50, y, 30, 30).fill('green');
    doc.rect(80, yPost - 9, 1, 30).fill('#d4d6d9');

    // NAME
    doc.rect(80, y, 180, 30).fill('pink');
    doc.rect(260, yPost - 9, 1, 30).fill('#d4d6d9');

    // Q
    doc.rect(260, y, 40, 30).fill('orange');
    doc.rect(300, yPost - 9, 1, 30).fill('#d4d6d9');

    // NET
    doc.rect(300, y, 80, 30).fill('red');
    doc.rect(380, yPost - 9, 1, 30).fill('#d4d6d9');

    // VAT
    doc.rect(380, y, 40, 30).fill('brown');
    doc.rect(420, yPost - 9, 1, 30).fill('#d4d6d9');

    // GROSS
    doc.rect(420, y, 80, 30).fill('yellow');
    doc.rect(500, yPost - 9, 1, 30).fill('#d4d6d9');

    // BORDERS
    doc.rect(545, y, 1, 30).fill('#d4d6d9');
    doc.rect(50, y, 1, 30).fill('#d4d6d9');
  }

  doc.rect(50, y, 496, 1).fill('#d4d6d9');

  // COLUMNS
  // // LP
  // doc.fontSize(10).fill('#333').text(number, 50, yPost, {
  //   width: 30,
  //   align: 'center',
  // });
  //
  // // NAME
  // doc.fontSize(10).fill('#333').text(name, 85, yPost, {
  //   width: 175,
  //   align: 'left',
  // });
  //
  // // Q
  // doc.fontSize(10).fill('#333').text(quantity, 260, yPost, {
  //   width: 40,
  //   align: 'center',
  // });
  //
  // // NET
  // doc.fontSize(10).fill('#333').text(net_value, 300, yPost, {
  //   width: 80,
  //   align: 'center',
  // });
  //
  // // VAT
  // doc.fontSize(10).fill('#333').text(tax_rate, 380, yPost, {
  //   width: 40,
  //   align: 'center',
  // });
};

const generateTableSummary = (doc: PDFKit.PDFDocument, y: number) => {
  generateLine(doc, y);
  doc.text('summary', 447, y, { width: 90, align: 'right' });
};

function generateLine(doc: PDFKit.PDFDocument, y: number) {
  doc.strokeColor('#d4d6d9').lineWidth(1).moveTo(50, y).lineTo(545, y).stroke();
}

export default GenerateInvoice;
