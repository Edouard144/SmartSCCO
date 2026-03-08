const express = require('express');
const router = express.Router();
const {
  createBranch, getAllBranches, getBranch,
  updateBranch, assignUserToBranch, deleteBranch
} = require('../controllers/branchController');
const { protect } = require('../utils/authMiddleware');
const { allowRoles } = require('../utils/roleMiddleware');

/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: Get all branches
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of branches
 */
router.get('/', protect, getAllBranches);

/**
 * @swagger
 * /api/branches:
 *   post:
 *     summary: Create a new branch (Superadmin only)
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Kigali Main Branch"
 *               location:
 *                 type: string
 *                 example: "KG 123 St, Kigali"
 *               phone:
 *                 type: string
 *                 example: "+250788000000"
 *               manager_id:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Branch created
 */
router.post('/', protect, allowRoles('superadmin'), createBranch);

/**
 * @swagger
 * /api/branches/{branch_id}:
 *   get:
 *     summary: Get a branch with its members
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branch_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Branch details with members
 */
router.get('/:branch_id', protect, getBranch);

/**
 * @swagger
 * /api/branches/{branch_id}:
 *   put:
 *     summary: Update a branch (Admin only)
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branch_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Branch updated
 */
router.put('/:branch_id', protect, allowRoles('staff', 'superadmin'), updateBranch);

/**
 * @swagger
 * /api/branches/{branch_id}/assign:
 *   post:
 *     summary: Assign a user to a branch (Admin only)
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branch_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id]
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: User assigned to branch
 */
router.post('/:branch_id/assign', protect, allowRoles('staff', 'superadmin'), assignUserToBranch);

/**
 * @swagger
 * /api/branches/{branch_id}:
 *   delete:
 *     summary: Delete a branch (Superadmin only)
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branch_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Branch deleted
 */
router.delete('/:branch_id', protect, allowRoles('superadmin'), deleteBranch);

module.exports = router;