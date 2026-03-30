const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes are protected (JWT required).
router.use(protect);

/**
 * @openapi
 * /api/v1/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string, example: "Buy groceries" }
 *               description: { type: string, example: "Milk, eggs, bread" }
 *               status: { type: string, enum: [pending, in-progress, completed], example: "pending" }
 *               priority: { type: string, enum: [low, medium, high], example: "medium" }
 *               dueDate: { type: string, format: date, example: "2026-04-01" }
 *     responses:
 *       201:
 *         description: Task created
 */
router.route('/').post(createTask)

/**
 * @openapi
 * /api/v1/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all tasks (admin gets all, user gets own)
 *     responses:
 *       200:
 *         description: List tasks
 */
router.route('/').get(getTasks);

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get a single task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task found
 */
router.route('/:id').get(getTaskById);

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update a task (title/description/status/priority/dueDate)
 *     responses:
 *       200:
 *         description: Task updated
 */
router.route('/:id').put(updateTask);

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.route('/:id').delete(deleteTask);

module.exports = router;