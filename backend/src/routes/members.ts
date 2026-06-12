import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { pool } from '../index';

const router = express.Router();

// Create member
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, dateOfBirth, placeOfBirth, nationality, cniNumber, address, profession, phone, email } = req.body;

    const result = await pool.query(
      'INSERT INTO members (cooperative_id, first_name, last_name, date_of_birth, place_of_birth, nationality, cni_number, address, profession, phone, email, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) RETURNING *',
      [req.cooperativeId, firstName, lastName, dateOfBirth, placeOfBirth, nationality, cniNumber, address, profession, phone, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// Get all members
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM members WHERE cooperative_id = $1 ORDER BY last_name, first_name',
      [req.cooperativeId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Search members
router.get('/search/:query', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const query = `%${req.params.query}%`;
    const result = await pool.query(
      'SELECT * FROM members WHERE cooperative_id = $1 AND (first_name ILIKE $2 OR last_name ILIKE $2 OR cni_number ILIKE $2) ORDER BY last_name, first_name LIMIT 20',
      [req.cooperativeId, query]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching members:', error);
    res.status(500).json({ error: 'Failed to search members' });
  }
});

// Get member by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM members WHERE id = $1 AND cooperative_id = $2',
      [req.params.id, req.cooperativeId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

export default router;
