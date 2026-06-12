import { Workbook } from 'exceljs';

export function generateExcelReport(payments: any[], month: string, year: string): Buffer {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Versements');

  // Headers
  worksheet.columns = [
    { header: 'N°', key: 'number', width: 5 },
    { header: 'Nom', key: 'last_name', width: 15 },
    { header: 'Prénom', key: 'first_name', width: 15 },
    { header: 'CNI', key: 'cni_number', width: 15 },
    { header: 'Adresse', key: 'address', width: 20 },
    { header: 'Téléphone', key: 'phone', width: 15 },
    { header: 'Date Versement', key: 'payment_date', width: 12 },
    { header: 'Montant', key: 'amount', width: 12 },
    { header: 'Motif', key: 'motif', width: 20 }
  ];

  // Add data
  payments.forEach((payment, index) => {
    worksheet.addRow({
      number: index + 1,
      last_name: payment.last_name,
      first_name: payment.first_name,
      cni_number: payment.cni_number,
      address: payment.address,
      phone: payment.phone,
      payment_date: new Date(payment.payment_date).toLocaleDateString(),
      amount: payment.amount,
      motif: payment.motif
    });
  });

  // Format header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

  // Add totals
  const totalRow = worksheet.addRow({});
  totalRow.getCell(7).value = 'TOTAL:';
  totalRow.getCell(8).value = { formula: `SUM(H2:H${payments.length + 1})` };
  totalRow.getCell(8).font = { bold: true };

  return workbook.xlsx.writeBuffer();
}
