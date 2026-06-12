import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { pool } from '../index';

const router = express.Router();

// Get all cooperatives for admin
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cooperatives WHERE id = $1',
      [req.cooperativeId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cooperatives:', error);
    res.status(500).json({ error: 'Failed to fetch cooperatives' });
  }
});

// Get cooperative details
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cooperatives WHERE id = $1 AND id = $2',
      [req.params.id, req.cooperativeId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cooperative not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching cooperative:', error);
    res.status(500).json({ error: 'Failed to fetch cooperative' });
  }
});

// Update cooperative
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, responsibleName, responsibleCNI } = req.body;
    const result = await pool.query(
      'UPDATE cooperatives SET name = $1, responsible_name = $2, responsible_cni = $3, updated_at = NOW() WHERE id = $4 AND id = $5 RETURNING *',
      [name, responsibleName, responsibleCNI, req.params.id, req.cooperativeId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cooperative not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating cooperative:', error);
    res.status(500).json({ error: 'Failed to update cooperative' });
  }
});

export default router;
