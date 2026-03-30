const Joi = require('joi');

const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().min(1).max(500).required(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().iso().optional().allow(null),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).optional(),
  description: Joi.string().trim().min(1).max(500).optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().iso().optional().allow(null),
}).min(1); // Require at least one field for updates.

const getTaskIdParamsSchema = Joi.object({
  id: objectIdSchema.required(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  getTaskIdParamsSchema,
};

