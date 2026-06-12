import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { pool } from '../index';

const router = express.Router();

type PaymentMotif = 'Versement adhésion' | 'Versement acompte' | 'Versement mois' | 'Fin de versement';

// Create payment
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { memberId, amount, paymentDate, motif, monthNumber } = req.body;

    if (!memberId || !amount || !paymentDate || !motif) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO payments (member_id, cooperative_id, amount, payment_date, motif, month_number, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
      [memberId, req.cooperativeId, amount, paymentDate, motif, monthNumber || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Get payments by member
router.get('/member/:memberId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT p.* FROM payments p JOIN members m ON p.member_id = m.id WHERE p.member_id = $1 AND p.cooperative_id = $2 ORDER BY p.payment_date DESC',
      [req.params.memberId, req.cooperativeId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get all payments
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT p.*, m.first_name, m.last_name FROM payments p JOIN members m ON p.member_id = m.id WHERE p.cooperative_id = $1 ORDER BY p.payment_date DESC',
      [req.cooperativeId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

export default router;
