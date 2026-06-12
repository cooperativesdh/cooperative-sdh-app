import PDFDocument from 'pdfkit';

interface DischargeData {
  member: { firstName: string; lastName: string; cniNumber: string };
  amount: number;
  paymentDate: string;
  motif: string;
  responsibleName: string;
  cooperativeName: string;
}

function numberToWords(num: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

  if (num === 0) return 'zéro';
  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? '-' + units[num % 10] : '');
  if (num < 1000) return units[Math.floor(num / 100)] + ' cent' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
  
  return num.toString();
}

export function generateDischargePDF(data: DischargeData): Buffer {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  // Title
  doc.fontSize(12).text('DÉCHARGE', { align: 'center', underline: true });
  doc.moveDown(0.5);

  // Content
  doc.fontSize(10);
  doc.text(`JE SOUSSIGNE ${data.responsibleName.toUpperCase()}`, { width: 500 });
  doc.text(`FONCTION: Responsable de la coopérative ${data.cooperativeName}`, { width: 500 });
  doc.moveDown(0.3);

  doc.text(`PIÈCE D'IDENTITÉ/PASSEPORT/PERMIS DE CONDUIRE N°: ..................`, { width: 500 });
  doc.moveDown(0.5);

  doc.text(`A REÇU DE ${data.member.firstName} ${data.member.lastName}`, { width: 500 });
  doc.moveDown(0.3);

  doc.text('MONTANT', { underline: true });
  doc.text(`EN CHIFFRE : ${data.amount} F CFA`, { width: 500 });
  doc.text(`EN LETTRE : ${numberToWords(Math.floor(data.amount))} francs CFA`, { width: 500 });
  doc.moveDown(0.3);

  doc.text(`MOTIF : ${data.motif}`, { width: 500 });
  doc.moveDown(0.5);

  doc.text('EN FOI DE QUOI CE PRÉSENT DÉCHARGE EST SIGNÉ POUR SERVIR ET VALOIR CE QUE DE DROIT.', { width: 500 });
  doc.moveDown(0.8);

  // Date
  const date = new Date(data.paymentDate);
  const dateStr = `${date.getDate().toString().padStart(2, '0')} / ${(date.getMonth() + 1).toString().padStart(2, '0')} / ${date.getFullYear()}`;
  doc.text(`Thiès le ${dateStr}`, { width: 500 });
  doc.moveDown(1);

  // Signatures
  doc.text('LE BÉNÉFICIAIRE', 50, doc.y, { width: 200, align: 'center' });
  doc.text('LE CHEF DE PROJET', 300, doc.y - 20, { width: 200, align: 'center' });

  doc.end();

  return Buffer.concat(buffers);
}
