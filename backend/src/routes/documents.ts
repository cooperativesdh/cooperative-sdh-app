import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { pool } from '../index';
import { generateDischargePDF } from '../services/pdf';
import { generateExcelReport } from '../services/excel';

const router = express.Router();

// Generate discharge PDF
router.post('/discharge-pdf', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { memberId, paymentId, amount, paymentDate, motif, responsibleName } = req.body;

    if (!memberId || !amount || !paymentDate || !motif || !responsibleName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get member details
    const memberResult = await pool.query(
      'SELECT * FROM members WHERE id = $1 AND cooperative_id = $2',
      [memberId, req.cooperativeId]
    );
    if (memberResult.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const member = memberResult.rows[0];
    const pdfBuffer = generateDischargePDF({
      member: {
        firstName: member.first_name,
        lastName: member.last_name,
        cniNumber: member.cni_number
      },
      amount,
      paymentDate,
      motif,
      responsibleName,
      cooperativeName: 'Cité Notre-Dame'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="decharge_${member.last_name}_${paymentDate}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Generate Excel report
router.get('/excel-report/:month/:year', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.params;

    // Get all payments for the month
    const result = await pool.query(
      `SELECT p.*, m.first_name, m.last_name, m.cni_number, m.address, m.phone 
       FROM payments p 
       JOIN members m ON p.member_id = m.id 
       WHERE p.cooperative_id = $1 
       AND EXTRACT(MONTH FROM p.payment_date) = $2 
       AND EXTRACT(YEAR FROM p.payment_date) = $3 
       ORDER BY m.last_name, m.first_name`,
      [req.cooperativeId, month, year]
    );

    const excelBuffer = generateExcelReport(result.rows, month, year);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="rapport_${month}_${year}.xlsx"`);
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ error: 'Failed to generate Excel' });
  }
});

export default router;
