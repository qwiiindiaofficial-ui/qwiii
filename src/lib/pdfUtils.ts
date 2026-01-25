import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './exportUtils';

interface InvoicePDFData {
  invoice_number: string;
  issue_date: string;
  due_date: string;
  client: {
    name?: string;
    company?: string;
    gst_number?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  notes?: string;
  payment_date?: string;
}

interface AgreementPDFData {
  agreement_number: string;
  title: string;
  type: string;
  start_date: string;
  end_date: string;
  value: number;
  client: {
    name?: string;
    company?: string;
    email?: string;
  };
  terms?: string[];
  signatory_client?: string;
  signatory_company?: string;
  signed_date?: string;
  notes?: string;
}

interface QuotationPDFData {
  quote_number: string;
  created_at: string;
  valid_until: string;
  client: {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    product: string;
    description?: string;
    quantity: number;
    unit_price: number;
    discount?: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  terms?: string;
  notes?: string;
}

const addHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.width;

  doc.setFillColor(17, 24, 39);
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setFillColor(59, 130, 246);
  doc.rect(0, 55, pageWidth, 5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('QWII', 20, 28);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('OPTIMIZE VISION', 20, 40);
  doc.text('GST: [Your GST Number]', 20, 48);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth - 20, 38, { align: 'right' });

  doc.setTextColor(0, 0, 0);
};

const addFooter = (doc: jsPDF, pageNumber: number) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Generated on ${new Date().toLocaleDateString('en-IN')} | Page ${pageNumber}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};

export const generateInvoicePDF = (data: InvoicePDFData) => {
  const doc = new jsPDF();

  addHeader(doc, 'TAX INVOICE');

  let yPos = 72;

  doc.setFillColor(239, 246, 255);
  doc.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F');

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(`Invoice #${data.invoice_number}`, 20, yPos);
  doc.setTextColor(0, 0, 0);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(15, yPos - 3, 85, 45, 2, 2, 'F');
  doc.roundedRect(105, yPos - 3, 90, 30, 2, 2, 'F');

  doc.text('BILL TO:', 20, yPos);
  doc.text('INVOICE DETAILS:', 110, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(data.client.company || data.client.name || 'N/A', 20, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Issue Date:`, 110, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(data.issue_date), 145, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'normal');
  if (data.client.address) {
    const addressLines = doc.splitTextToSize(data.client.address, 75);
    doc.text(addressLines, 20, yPos);
    yPos += addressLines.length * 5;
  }

  if (data.client.city || data.client.state) {
    const location = [data.client.city, data.client.state].filter(Boolean).join(', ');
    doc.text(location, 20, yPos);
    yPos += 5;
  }

  let detailsY = 82;
  doc.text(`Due Date:`, 110, detailsY);
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(data.due_date), 145, detailsY);
  detailsY += 6;

  doc.setFont('helvetica', 'normal');
  if (data.client.gst_number) {
    doc.text(`GSTIN: ${data.client.gst_number}`, 20, yPos);
    yPos += 5;
  }

  if (data.client.phone) {
    doc.text(`Phone: ${data.client.phone}`, 20, yPos);
    yPos += 5;
  }

  if (data.client.email) {
    doc.text(`Email: ${data.client.email}`, 20, yPos);
    yPos += 5;
  }

  yPos = Math.max(yPos + 10, 140);

  const tableData = data.items.map((item, index) => [
    index + 1,
    item.description,
    item.quantity,
    `₹${item.rate.toLocaleString('en-IN')}`,
    `₹${item.amount.toLocaleString('en-IN')}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 80 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  const summaryX = 120;
  const summaryWidth = 75;

  doc.setFillColor(249, 250, 251);
  doc.roundedRect(summaryX - 5, yPos - 5, summaryWidth,
    (data.cgst > 0 ? 40 : data.igst > 0 ? 35 : 28), 2, 2, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.text('Subtotal:', summaryX, yPos);
  doc.text(`₹${data.subtotal.toLocaleString('en-IN')}`, summaryX + summaryWidth - 10, yPos, { align: 'right' });
  yPos += 7;

  if (data.cgst > 0) {
    doc.text('CGST:', summaryX, yPos);
    doc.text(`₹${data.cgst.toLocaleString('en-IN')}`, summaryX + summaryWidth - 10, yPos, { align: 'right' });
    yPos += 6;

    doc.text('SGST:', summaryX, yPos);
    doc.text(`₹${data.sgst.toLocaleString('en-IN')}`, summaryX + summaryWidth - 10, yPos, { align: 'right' });
    yPos += 7;
  }

  if (data.igst > 0) {
    doc.text('IGST:', summaryX, yPos);
    doc.text(`₹${data.igst.toLocaleString('en-IN')}`, summaryX + summaryWidth - 10, yPos, { align: 'right' });
    yPos += 7;
  }

  doc.setLineWidth(0.3);
  doc.setDrawColor(59, 130, 246);
  doc.line(summaryX, yPos, summaryX + summaryWidth - 10, yPos);
  yPos += 7;

  doc.setFillColor(30, 64, 175);
  doc.roundedRect(summaryX - 5, yPos - 5, summaryWidth, 12, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Total:', summaryX, yPos);
  doc.text(`₹${data.total.toLocaleString('en-IN')}`, summaryX + summaryWidth - 10, yPos, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  yPos += 15;

  if (data.notes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Notes:', 20, yPos);
    yPos += 6;
    const notesLines = doc.splitTextToSize(data.notes, 170);
    doc.text(notesLines, 20, yPos);
  }

  addFooter(doc, 1);

  doc.save(`Invoice-${data.invoice_number}.pdf`);
};

export const generateAgreementPDF = (data: AgreementPDFData) => {
  const doc = new jsPDF();

  addHeader(doc, 'AGREEMENT');

  let yPos = 60;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(data.title, 170);
  doc.text(titleLines, 20, yPos);
  yPos += titleLines.length * 8 + 5;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Agreement No: ${data.agreement_number}`, 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Agreement Details', 20, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'normal');

  const details = [
    ['Type:', data.type.toUpperCase()],
    ['Client:', data.client.company || data.client.name || 'N/A'],
    ['Start Date:', formatDate(data.start_date)],
    ['End Date:', formatDate(data.end_date)],
    ['Value:', data.value > 0 ? `₹${data.value.toLocaleString('en-IN')}` : 'N/A'],
  ];

  if (data.signed_date) {
    details.push(['Signed On:', formatDate(data.signed_date)]);
  }

  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 55, yPos);
    yPos += 7;
  });

  yPos += 5;

  if (data.terms && data.terms.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions', 20, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    data.terms.forEach((term, index) => {
      if (yPos > 270) {
        doc.addPage();
        addHeader(doc, 'AGREEMENT');
        yPos = 60;
      }

      const termText = `${index + 1}. ${term}`;
      const termLines = doc.splitTextToSize(termText, 170);
      doc.text(termLines, 20, yPos);
      yPos += termLines.length * 6 + 3;
    });

    yPos += 5;
  }

  if (yPos > 240) {
    doc.addPage();
    addHeader(doc, 'AGREEMENT');
    yPos = 60;
  }

  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Signatories', 20, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.text('Client Representative:', 20, yPos);
  doc.text('Company Representative:', 110, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text(data.signatory_client || '___________________', 20, yPos);
  doc.text(data.signatory_company || '___________________', 110, yPos);
  yPos += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Signature: ___________________', 20, yPos);
  doc.text('Signature: ___________________', 110, yPos);
  yPos += 7;
  doc.text('Date: ___________________', 20, yPos);
  doc.text('Date: ___________________', 110, yPos);

  addFooter(doc, 1);

  doc.save(`Agreement-${data.agreement_number}.pdf`);
};

export const generateQuotationPDF = (data: QuotationPDFData) => {
  const doc = new jsPDF();

  addHeader(doc, 'QUOTATION');

  let yPos = 72;

  doc.setFillColor(239, 246, 255);
  doc.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F');

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(`Quote #${data.quote_number}`, 20, yPos);
  doc.setTextColor(0, 0, 0);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(15, yPos - 3, 85, 40, 2, 2, 'F');
  doc.roundedRect(105, yPos - 3, 90, 25, 2, 2, 'F');

  doc.text('QUOTE FOR:', 20, yPos);
  doc.text('QUOTE DETAILS:', 110, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(data.client.company || data.client.name || 'N/A', 20, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Created:`, 110, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(data.created_at), 145, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'normal');
  if (data.client.email) {
    doc.text(`Email: ${data.client.email}`, 20, yPos);
  }
  doc.text(`Valid Until:`, 110, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(data.valid_until), 145, yPos);
  yPos += 5;

  doc.setFont('helvetica', 'normal');
  if (data.client.phone) {
    doc.text(`Phone: ${data.client.phone}`, 20, yPos);
    yPos += 5;
  }

  yPos = Math.max(yPos + 10, 135);

  const tableData = data.items.map((item, index) => [
    index + 1,
    item.product + (item.description ? `\n${item.description}` : ''),
    item.quantity,
    `₹${item.unit_price.toLocaleString('en-IN')}`,
    item.discount ? `${item.discount}%` : '-',
    `₹${item.total.toLocaleString('en-IN')}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Product', 'Qty', 'Unit Price', 'Disc', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 30, halign: 'right' },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  const summaryX = 130;
  doc.setFontSize(10);

  doc.text('Subtotal:', summaryX, yPos);
  doc.text(`₹${data.subtotal.toLocaleString('en-IN')}`, 185, yPos, { align: 'right' });
  yPos += 7;

  if (data.discount > 0) {
    doc.setTextColor(34, 197, 94);
    doc.text('Discount:', summaryX, yPos);
    doc.text(`-₹${data.discount.toLocaleString('en-IN')}`, 185, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    yPos += 7;
  }

  doc.text('Tax:', summaryX, yPos);
  doc.text(`₹${data.tax.toLocaleString('en-IN')}`, 185, yPos, { align: 'right' });
  yPos += 7;

  doc.setLineWidth(0.5);
  doc.line(summaryX, yPos, 185, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', summaryX, yPos);
  doc.text(`₹${data.total.toLocaleString('en-IN')}`, 185, yPos, { align: 'right' });
  yPos += 10;

  if (data.terms) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Terms & Conditions:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    const termsLines = doc.splitTextToSize(data.terms, 170);
    doc.text(termsLines, 20, yPos);
    yPos += termsLines.length * 5;
  }

  if (data.notes) {
    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Notes:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(data.notes, 170);
    doc.text(notesLines, 20, yPos);
  }

  addFooter(doc, 1);

  doc.save(`Quotation-${data.quote_number}.pdf`);
};
