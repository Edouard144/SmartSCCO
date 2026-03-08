const pool = require('../db');
const { logAction } = require('../utils/auditLogger');

// CREATE BRANCH — superadmin only
const createBranch = async (req, res) => {
  try {
    const { name, location, phone, manager_id } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Branch name and location are required' });
    }

    // If manager_id given, check they exist and are staff
    if (manager_id) {
      const manager = await pool.query(
        `SELECT id, role FROM users WHERE id = $1`, [manager_id]
      );
      if (!manager.rows[0]) {
        return res.status(404).json({ error: 'Manager user not found' });
      }
      if (!['staff', 'superadmin'].includes(manager.rows[0].role)) {
        return res.status(400).json({ error: 'Manager must be a staff member' });
      }
    }

    const result = await pool.query(
      `INSERT INTO branches (name, location, phone, manager_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, location, phone || null, manager_id || null]
    );

    // Log action
    await logAction(
      req.user.id, 'BRANCH_CREATED',
      result.rows[0].branch_id, 'branch',
      `Branch "${name}" created at ${location}`,
      req.ip
    );

    res.status(201).json({ message: 'Branch created', branch: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET ALL BRANCHES
const getAllBranches = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.full_name as manager_name, u.phone as manager_phone,
              COUNT(members.id) as total_members
       FROM branches b
       LEFT JOIN users u ON b.manager_id = u.id
       LEFT JOIN users members ON members.branch_id = b.branch_id
       GROUP BY b.branch_id, u.full_name, u.phone
       ORDER BY b.created_at DESC`
    );
    res.json({ branches: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET SINGLE BRANCH with its members
const getBranch = async (req, res) => {
  try {
    const { branch_id } = req.params;

    const branch = await pool.query(
      `SELECT b.*, u.full_name as manager_name
       FROM branches b
       LEFT JOIN users u ON b.manager_id = u.id
       WHERE b.branch_id = $1`,
      [branch_id]
    );

    if (!branch.rows[0]) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    // Get members in this branch
    const members = await pool.query(
      `SELECT id, full_name, email, phone, role, kyc_status, created_at
       FROM users WHERE branch_id = $1`,
      [branch_id]
    );

    res.json({
      branch: branch.rows[0],
      members: members.rows,
      total_members: members.rows.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE BRANCH
const updateBranch = async (req, res) => {
  try {
    const { branch_id } = req.params;
    const { name, location, phone, manager_id } = req.body;

    const result = await pool.query(
      `UPDATE branches SET
        name = COALESCE($1, name),
        location = COALESCE($2, location),
        phone = COALESCE($3, phone),
        manager_id = COALESCE($4, manager_id)
       WHERE branch_id = $5
       RETURNING *`,
      [name, location, phone, manager_id, branch_id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    await logAction(
      req.user.id, 'BRANCH_UPDATED',
      branch_id, 'branch',
      `Branch ${branch_id} updated`,
      req.ip
    );

    res.json({ message: 'Branch updated', branch: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ASSIGN USER TO BRANCH
const assignUserToBranch = async (req, res) => {
  try {
    const { branch_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    // Check branch exists
    const branch = await pool.query(
      `SELECT * FROM branches WHERE branch_id = $1`, [branch_id]
    );
    if (!branch.rows[0]) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    // Assign user
    const result = await pool.query(
      `UPDATE users SET branch_id = $1 WHERE id = $2 RETURNING id, full_name, branch_id`,
      [branch_id, user_id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }

    await logAction(
      req.user.id, 'USER_ASSIGNED_TO_BRANCH',
      user_id, 'user',
      `User ${user_id} assigned to branch ${branch_id}`,
      req.ip
    );

    res.json({ message: 'User assigned to branch', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE BRANCH — superadmin only
const deleteBranch = async (req, res) => {
  try {
    const { branch_id } = req.params;

    // Remove branch from all users first
    await pool.query(
      `UPDATE users SET branch_id = NULL WHERE branch_id = $1`, [branch_id]
    );

    const result = await pool.query(
      `DELETE FROM branches WHERE branch_id = $1 RETURNING *`, [branch_id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    await logAction(
      req.user.id, 'BRANCH_DELETED',
      branch_id, 'branch',
      `Branch ${branch_id} deleted`,
      req.ip
    );

    res.json({ message: 'Branch deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createBranch, getAllBranches, getBranch,
  updateBranch, assignUserToBranch, deleteBranch
};