import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../index';

const router = express.Router();

// Register Admin
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, cooperativeName } = req.body;

    if (!email || !password || !fullName || !cooperativeName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email exists
    const userCheck = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create cooperative first
    const coopResult = await pool.query(
      'INSERT INTO cooperatives (name, created_at) VALUES ($1, NOW()) RETURNING id',
      [cooperativeName]
    );
    const cooperativeId = coopResult.rows[0].id;

    // Create admin
    const adminResult = await pool.query(
      'INSERT INTO admins (email, password, full_name, cooperative_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, full_name',
      [email, hashedPassword, fullName, cooperativeId]
    );

    const admin = adminResult.rows[0];
    const token = jwt.sign(
      { id: admin.id, adminId: admin.id, cooperativeId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      admin: { id: admin.id, email: admin.email, fullName: admin.full_name, cooperativeId }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login Admin
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, adminId: admin.id, cooperativeId: admin.cooperative_id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin.id, email: admin.email, fullName: admin.full_name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
