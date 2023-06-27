import { join } from 'path';
import * as PDFDocument from 'pdfkit';

import { Invoice } from '../schemas/invoice.schema';
import { Order } from '../schemas/order.schema';
import { formatPrice } from './formatPrice';

const generateInvoicePdf = async (invoice: Invoice, order: Order) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    lang: 'PL',
    pdfVersion: '1.7',
    compress: true,
  });

  doc.registerFont(
    'Roboto',
    join(__dirname, '/fonts/roboto/Roboto-Regular.ttf'),
  );
  doc.registerFont(
    'Roboto-Bold',
    join(__dirname, '/fonts/roboto/Roboto-Medium.ttf'),
  );

  generateHeader(doc);

  invoice.billing.vatNumber
    ? generateCompanyCustomerInformation(doc, invoice, order)
    : generateCustomerInformation(doc, invoice, order);

  generateInvoiceTable(doc, invoice, order);
  // generateFooter(doc);

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

const generateHeader = (doc: PDFKit.PDFDocument) => {
  doc
    .image(join(__dirname, '/img/bpa-logo.png'), 50, 45, { width: 150 })
    .fillColor('#444444')
    .fontSize(20)
    .fontSize(10)
    .font('Roboto')
    .text('Olga Wałek Fotografia', 200, 50, { align: 'right' })
    .text('NIP: 8992879263', 200, 65, { align: 'right' })
    .text('ul. Szkolna 10', 200, 80, { align: 'right' })
    .text('98-432, Polska', 200, 95, { align: 'right' })
    .moveDown();
};

const generateCustomerInformation = (
  doc: PDFKit.PDFDocument,
  inv: Invoice,
  order: Order,
) => {
  doc.fillColor('#444444').fontSize(20).text('Faktura', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  const invNumber = inv.invoiceNumber;

  const invDay = new Date(inv.paidAt).getDate().toString().padStart(2, '0');
  const invMonth = new Date(inv.paidAt).getMonth() + 1;
  const invYear = new Date(inv.paidAt).getFullYear();

  const orderDay = new Date(inv.createdAt)
    .getDate()
    .toString()
    .padStart(2, '0');
  const orderMonth = new Date(inv.createdAt).getMonth() + 1;
  const orderYear = new Date(inv.createdAt).getFullYear();

  const invoiceTitle = `${invNumber}/${invMonth}/${invYear}`;
  const invoiceDate = `${invDay}/${invMonth}/${invYear}`;

  const orderDate = `${orderDay}/${orderMonth}/${orderYear}`;

  doc
    .fontSize(10)
    .text(`Faktura numer:`, 50, customerInformationTop)
    .font('Roboto-Bold')
    .text(`${invoiceTitle}`, 150, customerInformationTop)
    .font('Roboto')
    .text('Data płatności:', 50, customerInformationTop + 15)
    .text(`${invoiceDate}`, 150, customerInformationTop + 15)
    .text('Data zamówienia:', 50, customerInformationTop + 30)
    .text(`${orderDate}`, 150, customerInformationTop + 30)
    .text('Numer zamówienia:', 50, customerInformationTop + 45)
    .text(order.orderId, 150, customerInformationTop + 45)

    .font('Roboto-Bold')
    .text(
      `${inv.billing.firstName} ${inv.billing.lastName}`,
      300,
      customerInformationTop,
    )
    .font('Roboto')
    .text(`${inv.billing.street}`, 300, customerInformationTop + 15)
    .text(
      `${inv.billing.city}` +
        ', ' +
        `${inv.billing.postCode}` +
        ', ' +
        `${inv.billing.country}`,
      300,
      customerInformationTop + 30,
    )
    .moveDown();

  generateHr(doc, 252 + 15);
};

const generateCompanyCustomerInformation = (
  doc: PDFKit.PDFDocument,
  inv: Invoice,
  order: Order,
) => {
  doc.fillColor('#444444').fontSize(20).text('Faktura', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  const invNumber = inv.invoiceNumber;

  const invDay = new Date(inv.paidAt).getDate().toString().padStart(2, '0');
  const invMonth = new Date(inv.paidAt).getMonth() + 1;
  const invYear = new Date(inv.paidAt).getFullYear();

  const orderDay = new Date(inv.createdAt)
    .getDate()
    .toString()
    .padStart(2, '0');
  const orderMonth = new Date(inv.createdAt).getMonth() + 1;
  const orderYear = new Date(inv.createdAt).getFullYear();

  const invoiceTitle = `${invNumber}/${invMonth}/${invYear}`;
  const invoiceDate = `${invDay}/${invMonth}/${invYear}`;

  const orderDate = `${orderDay}/${orderMonth}/${orderYear}`;

  const biggerGaps = inv.billing.companyName.length > 39;

  doc
    .fontSize(10)
    .text(`Faktura numer:`, 50, customerInformationTop)
    .font('Roboto-Bold')
    .text(`${invoiceTitle}`, 150, customerInformationTop)
    .font('Roboto')
    .text('Data płatności:', 50, customerInformationTop + 15)
    .text(`${invoiceDate}`, 150, customerInformationTop + 15)
    .text('Data zamówienia:', 50, customerInformationTop + 30)
    .text(`${orderDate}`, 150, customerInformationTop + 30)
    .text('Numer zamówienia:', 50, customerInformationTop + 45)
    .text(order.orderId, 150, customerInformationTop + 45)

    .font('Roboto-Bold')
    .text(inv.billing.companyName, 300, customerInformationTop)
    .font('Roboto')
    .text(
      `NIP: ${inv.billing.vatNumber}`,
      300,
      !biggerGaps ? customerInformationTop + 15 : customerInformationTop + 30,
    )
    .font('Roboto')
    .text(
      `${inv.billing.companyStreet}`,
      300,
      !biggerGaps ? customerInformationTop + 30 : customerInformationTop + 45,
    )
    .text(
      `${inv.billing.companyCity}` +
        ', ' +
        `${inv.billing.companyPostCode}` +
        ', ' +
        `${inv.billing.companyCountry}`,
      300,
      !biggerGaps ? customerInformationTop + 45 : customerInformationTop + 60,
    )
    .moveDown();

  generateHr(doc, !biggerGaps ? 272 + 15 : 272 + 30);
};

const generateInvoiceTable = (
  doc: PDFKit.PDFDocument,
  inv: Invoice,
  order: Order,
) => {
  let i;
  const invoiceTableTop = 330;

  doc.font('Roboto-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Nazwa',
    '',
    'Kwota netto',
    `VAT ${process.env.TAX_RATE}%`,
    'Kwota brutto',
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Roboto');

  for (i = 0; i < order.orderItems.length; i++) {
    const position = invoiceTableTop + (i + 1) * 30;
    const price = order.orderItems[i].price;
    const tax = order.orderItems[i].tax;

    generateTableRow(
      doc,
      position,
      `Kurs Video - ${order.orderItems[i].product.name}`,
      '',
      formatPrice(price),
      formatPrice(tax),
      formatPrice(price + tax),
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;

  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    'Suma częściowa',
    '',
    formatPrice(inv.subtotal),
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    '',
    '',
    'Podatek',
    '',
    formatPrice(inv.tax),
  );

  const duePosition = paidToDatePosition + 25;
  doc.font('Roboto-Bold');
  generateTableRow(
    doc,
    duePosition,
    '',
    '',
    'Razem',
    '',
    formatPrice(inv.total),
  );
  doc.font('Roboto');
};

function generateFooter(doc) {
  doc

    .image('signature_sample.png', 300, 500, { width: 50, align: 'center' })
    .fontSize(10)
    .text(
      'Payment is due within 15 days. Thank you. How to pay ? Options below.',
      50,
      600,
      { align: 'center' },
    )
    .text('Paypal -> paypal.me/test1234', 50, 620, {
      align: 'center',
      link: 'https://www.paypal.com/paypalme/test1234',
      underline: true,
    })
    .text('Lydia -> 06 66 97 06 70', 50, 640, { align: 'center' })
    .text('RIB -> me contact me', 50, 660, { align: 'center' })
    .text(
      'By kofi https://ko-fi.com/dev_it_out ( click here ) then click on Donate and enter the amount + send me a screenshot',
      50,
      680,
      {
        align: 'center',
        link: 'https://ko-fi.com/dev_it_out',
        underline: true,
      },
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal,
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' });
}

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(val) {
  return '€' + val.toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + '/' + month + '/' + day;
}

export default generateInvoicePdf;
