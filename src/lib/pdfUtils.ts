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
    city?: string;
    state?: string;
    country?: string;
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
    phone?: string;
    address?: string;
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
    address?: string;
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

const COLORS = {
  primary: [16, 185, 129],
  secondary: [59, 130, 246],
  dark: [17, 24, 39],
  gray: [107, 114, 128],
  lightGray: [243, 244, 246],
  white: [255, 255, 255],
  accent: [139, 92, 246],
};

const addModernHeader = (doc: jsPDF, title: string, docNumber: string) => {
  const pageWidth = doc.internal.pageSize.width;

  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 50, pageWidth, 3, 'F');

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('QWII', 20, 25);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('OPTIMIZE VISION', 20, 33);
  doc.text('Email: contact@qwii.com', 20, 39);
  doc.text('Phone: +91 XXXXXXXXXX', 20, 45);

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth - 20, 25, { align: 'right' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(docNumber, pageWidth - 20, 35, { align: 'right' });

  doc.setTextColor(...COLORS.dark);
};

const addModernFooter = (doc: jsPDF, pageNumber: number, totalPages: number = 1) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);

  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.setFont('helvetica', 'normal');

  doc.text(
    'Thank you for your business!',
    20,
    pageHeight - 18
  );

  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`,
    pageWidth / 2,
    pageHeight - 18,
    { align: 'center' }
  );

  doc.text(
    `Page ${pageNumber}${totalPages > 1 ? ` of ${totalPages}` : ''}`,
    pageWidth - 20,
    pageHeight - 18,
    { align: 'right' }
  );

  doc.setFontSize(7);
  doc.text(
    'QWII - Optimize Vision | Textile Industry Solutions',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};

const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const addInfoBox = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  title: string,
  content: Array<{ label: string; value: string; bold?: boolean }>
) => {
  doc.setFillColor(...COLORS.lightGray);
  doc.roundedRect(x, y, width, 6 + content.length * 6, 2, 2, 'F');

  doc.setFillColor(...COLORS.secondary);
  doc.roundedRect(x, y, width, 6, 2, 2, 'F');

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x + 3, y + 4);

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(9);

  content.forEach((item, index) => {
    const lineY = y + 10 + index * 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text(item.label, x + 3, lineY);

    doc.setFont('helvetica', item.bold ? 'bold' : 'normal');
    doc.setTextColor(...COLORS.dark);
    doc.text(item.value, x + width - 3, lineY, { align: 'right' });
  });
};

export const generateInvoicePDF = (data: InvoicePDFData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  addModernHeader(doc, 'TAX INVOICE', `#${data.invoice_number}`);

  let yPos = 63;

  const clientName = data.client.company || data.client.name || 'N/A';
  const clientAddress = [
    data.client.address,
    data.client.city,
    data.client.state,
    data.client.country
  ].filter(Boolean).join(', ');

  addInfoBox(doc, 20, yPos, 85, 'BILL TO', [
    { label: 'Client:', value: clientName, bold: true },
    ...(data.client.gst_number ? [{ label: 'GSTIN:', value: data.client.gst_number }] : []),
    ...(data.client.email ? [{ label: 'Email:', value: data.client.email }] : []),
    ...(data.client.phone ? [{ label: 'Phone:', value: data.client.phone }] : []),
    ...(clientAddress ? [{ label: 'Address:', value: clientAddress }] : []),
  ]);

  addInfoBox(doc, 110, yPos, 85, 'INVOICE DETAILS', [
    { label: 'Invoice Number:', value: data.invoice_number, bold: true },
    { label: 'Issue Date:', value: formatDate(data.issue_date) },
    { label: 'Due Date:', value: formatDate(data.due_date) },
    ...(data.payment_date ? [{ label: 'Paid On:', value: formatDate(data.payment_date) }] : []),
  ]);

  yPos += Math.max(30, 24 + Math.max(
    (data.client.gst_number ? 1 : 0) +
    (data.client.email ? 1 : 0) +
    (data.client.phone ? 1 : 0) +
    (clientAddress ? 1 : 0),
    2 + (data.payment_date ? 1 : 0)
  ) * 6);

  doc.setFillColor(...COLORS.secondary);
  doc.roundedRect(20, yPos, pageWidth - 40, 8, 2, 2, 'F');

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM DETAILS', 25, yPos + 5);
  doc.setTextColor(...COLORS.dark);

  yPos += 12;

  const tableData = data.items.map((item, index) => [
    String(index + 1),
    item.description,
    String(item.quantity),
    formatIndianCurrency(item.rate),
    formatIndianCurrency(item.amount),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center',
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 80 },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 38, halign: 'right' },
      4: { cellWidth: 38, halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  const summaryX = pageWidth - 90;
  const summaryWidth = 70;

  doc.setFillColor(...COLORS.lightGray);
  doc.roundedRect(summaryX, yPos - 3, summaryWidth,
    8 + (data.cgst > 0 ? 18 : 0) + (data.igst > 0 ? 6 : 0) + 12, 2, 2, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.dark);

  doc.text('Subtotal:', summaryX + 3, yPos);
  doc.text(formatIndianCurrency(data.subtotal), summaryX + summaryWidth - 3, yPos, { align: 'right' });
  yPos += 6;

  if (data.cgst > 0) {
    doc.text('CGST:', summaryX + 3, yPos);
    doc.text(formatIndianCurrency(data.cgst), summaryX + summaryWidth - 3, yPos, { align: 'right' });
    yPos += 6;

    doc.text('SGST:', summaryX + 3, yPos);
    doc.text(formatIndianCurrency(data.sgst), summaryX + summaryWidth - 3, yPos, { align: 'right' });
    yPos += 6;
  }

  if (data.igst > 0) {
    doc.text('IGST:', summaryX + 3, yPos);
    doc.text(formatIndianCurrency(data.igst), summaryX + summaryWidth - 3, yPos, { align: 'right' });
    yPos += 6;
  }

  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(summaryX + 3, yPos, summaryX + summaryWidth - 3, yPos);
  yPos += 6;

  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(summaryX, yPos - 3, summaryWidth, 10, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.white);
  doc.text('TOTAL', summaryX + 3, yPos + 3);
  doc.text(formatIndianCurrency(data.total), summaryX + summaryWidth - 3, yPos + 3, { align: 'right' });
  doc.setTextColor(...COLORS.dark);
  yPos += 15;

  if (data.notes) {
    doc.setFillColor(...COLORS.lightGray);
    const notesLines = doc.splitTextToSize(data.notes, pageWidth - 50);
    const notesHeight = notesLines.length * 5 + 8;
    doc.roundedRect(20, yPos, pageWidth - 40, notesHeight, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Notes:', 23, yPos + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(notesLines, 23, yPos + 10);
    yPos += notesHeight + 5;
  }

  addModernFooter(doc, 1);

  doc.save(`Invoice-${data.invoice_number}.pdf`);
};

export const generateAgreementPDF = (data: AgreementPDFData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  addModernHeader(doc, 'AGREEMENT', `#${data.agreement_number}`);

  let yPos = 65;

  doc.setFillColor(...COLORS.secondary);
  doc.roundedRect(20, yPos, pageWidth - 40, 10, 2, 2, 'F');

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(data.title, pageWidth - 50);
  doc.text(titleLines, pageWidth / 2, yPos + 6, { align: 'center' });
  doc.setTextColor(...COLORS.dark);

  yPos += 10 + titleLines.length * 3;

  addInfoBox(doc, 20, yPos, 85, 'PARTY DETAILS', [
    { label: 'Client:', value: data.client.company || data.client.name || 'N/A', bold: true },
    ...(data.client.email ? [{ label: 'Email:', value: data.client.email }] : []),
    ...(data.client.phone ? [{ label: 'Phone:', value: data.client.phone }] : []),
    ...(data.client.address ? [{ label: 'Address:', value: data.client.address }] : []),
  ]);

  addInfoBox(doc, 110, yPos, 85, 'AGREEMENT INFO', [
    { label: 'Type:', value: data.type.toUpperCase(), bold: true },
    { label: 'Start Date:', value: formatDate(data.start_date) },
    { label: 'End Date:', value: formatDate(data.end_date) },
    { label: 'Value:', value: data.value > 0 ? formatIndianCurrency(data.value) : 'N/A' },
    ...(data.signed_date ? [{ label: 'Signed On:', value: formatDate(data.signed_date) }] : []),
  ]);

  yPos += Math.max(30, 24 + Math.max(
    (data.client.email ? 1 : 0) + (data.client.phone ? 1 : 0) + (data.client.address ? 1 : 0),
    3 + (data.signed_date ? 1 : 0)
  ) * 6);

  if (data.terms && data.terms.length > 0) {
    doc.setFillColor(...COLORS.secondary);
    doc.roundedRect(20, yPos, pageWidth - 40, 8, 2, 2, 'F');

    doc.setTextColor(...COLORS.white);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMS & CONDITIONS', 25, yPos + 5);
    doc.setTextColor(...COLORS.dark);

    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    data.terms.forEach((term, index) => {
      if (yPos > 250) {
        addModernFooter(doc, 1);
        doc.addPage();
        addModernHeader(doc, 'AGREEMENT', `#${data.agreement_number}`);
        yPos = 65;
      }

      doc.setFillColor(...COLORS.lightGray);
      const termLines = doc.splitTextToSize(term, pageWidth - 55);
      const boxHeight = termLines.length * 5 + 4;
      doc.roundedRect(20, yPos - 2, pageWidth - 40, boxHeight, 1, 1, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.secondary);
      doc.text(`${index + 1}.`, 23, yPos + 2);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.dark);
      doc.text(termLines, 30, yPos + 2);

      yPos += boxHeight + 3;
    });

    yPos += 5;
  }

  if (yPos > 230) {
    addModernFooter(doc, 1);
    doc.addPage();
    addModernHeader(doc, 'AGREEMENT', `#${data.agreement_number}`);
    yPos = 65;
  }

  doc.setFillColor(...COLORS.secondary);
  doc.roundedRect(20, yPos, pageWidth - 40, 8, 2, 2, 'F');

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SIGNATURES', 25, yPos + 5);
  doc.setTextColor(...COLORS.dark);

  yPos += 14;

  doc.setFillColor(...COLORS.lightGray);
  doc.roundedRect(20, yPos, 75, 30, 2, 2, 'F');
  doc.roundedRect(120, yPos, 75, 30, 2, 2, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Representative', 23, yPos + 5);
  doc.text('Company Representative', 123, yPos + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(data.signatory_client || '___________________', 23, yPos + 12);
  doc.text(data.signatory_company || '___________________', 123, yPos + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Signature: ___________________', 23, yPos + 20);
  doc.text('Signature: ___________________', 123, yPos + 20);

  doc.text('Date: ___________________', 23, yPos + 26);
  doc.text('Date: ___________________', 123, yPos + 26);

  addModernFooter(doc, 1);

  doc.save(`Agreement-${data.agreement_number}.pdf`);
};

export const generateQuotationPDF = (data: QuotationPDFData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  addModernHeader(doc, 'QUOTATION', `#${data.quote_number}`);

  let yPos = 63;

  const clientName = data.client.company || data.client.name || 'N/A';
  const clientAddress = data.client.address || '';

  addInfoBox(doc, 20, yPos, 85, 'QUOTE FOR', [
    { label: 'Client:', value: clientName, bold: true },
    ...(data.client.email ? [{ label: 'Email:', value: data.client.email }] : []),
    ...(data.client.phone ? [{ label: 'Phone:', value: data.client.phone }] : []),
    ...(clientAddress ? [{ label: 'Address:', value: clientAddress }] : []),
  ]);

  addInfoBox(doc, 110, yPos, 85, 'QUOTE DETAILS', [
    { label: 'Quote Number:', value: data.quote_number, bold: true },
    { label: 'Created On:', value: formatDate(data.created_at) },
    { label: 'Valid Until:', value: formatDate(data.valid_until) },
  ]);

  yPos += Math.max(30, 24 + Math.max(
    (data.client.email ? 1 : 0) + (data.client.phone ? 1 : 0) + (clientAddress ? 1 : 0),
    2
  ) * 6);

  doc.setFillColor(...COLORS.secondary);
  doc.roundedRect(20, yPos, pageWidth - 40, 8, 2, 2, 'F');

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEMS & PRICING', 25, yPos + 5);
  doc.setTextColor(...COLORS.dark);

  yPos += 12;

  const tableData = data.items.map((item, index) => {
    const productText = item.product + (item.description ? `\n${item.description}` : '');
    return [
      String(index + 1),
      productText,
      String(item.quantity),
      formatIndianCurrency(item.unit_price),
      item.discount ? `${item.discount}%` : '-',
      formatIndianCurrency(item.total),
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Product', 'Qty', 'Unit Price', 'Disc', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center',
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 68 },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 34, halign: 'right' },
      4: { cellWidth: 18, halign: 'center' },
      5: { cellWidth: 36, halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  const summaryX = pageWidth - 90;
  const summaryWidth = 70;

  doc.setFillColor(...COLORS.lightGray);
  doc.roundedRect(summaryX, yPos - 3, summaryWidth,
    8 + (data.discount > 0 ? 6 : 0) + 12, 2, 2, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.dark);

  doc.text('Subtotal:', summaryX + 3, yPos);
  doc.text(formatIndianCurrency(data.subtotal), summaryX + summaryWidth - 3, yPos, { align: 'right' });
  yPos += 6;

  if (data.discount > 0) {
    doc.setTextColor(...COLORS.primary);
    doc.text('Discount:', summaryX + 3, yPos);
    doc.text(`-${formatIndianCurrency(data.discount)}`, summaryX + summaryWidth - 3, yPos, { align: 'right' });
    doc.setTextColor(...COLORS.dark);
    yPos += 6;
  }

  doc.text('Tax:', summaryX + 3, yPos);
  doc.text(formatIndianCurrency(data.tax), summaryX + summaryWidth - 3, yPos, { align: 'right' });
  yPos += 6;

  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(summaryX + 3, yPos, summaryX + summaryWidth - 3, yPos);
  yPos += 6;

  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(summaryX, yPos - 3, summaryWidth, 10, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.white);
  doc.text('TOTAL', summaryX + 3, yPos + 3);
  doc.text(formatIndianCurrency(data.total), summaryX + summaryWidth - 3, yPos + 3, { align: 'right' });
  doc.setTextColor(...COLORS.dark);
  yPos += 15;

  if (data.terms) {
    doc.setFillColor(...COLORS.lightGray);
    const termsLines = doc.splitTextToSize(data.terms, pageWidth - 50);
    const termsHeight = termsLines.length * 5 + 8;
    doc.roundedRect(20, yPos, pageWidth - 40, termsHeight, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Terms & Conditions:', 23, yPos + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(termsLines, 23, yPos + 10);
    yPos += termsHeight + 5;
  }

  if (data.notes) {
    doc.setFillColor(...COLORS.lightGray);
    const notesLines = doc.splitTextToSize(data.notes, pageWidth - 50);
    const notesHeight = notesLines.length * 5 + 8;
    doc.roundedRect(20, yPos, pageWidth - 40, notesHeight, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Notes:', 23, yPos + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(notesLines, 23, yPos + 10);
  }

  addModernFooter(doc, 1);

  doc.save(`Quotation-${data.quote_number}.pdf`);
};
