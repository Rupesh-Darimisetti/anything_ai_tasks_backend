const Task = require('../models/Task');
const { ApiError } = require('../utils/apiError');
const {
  createTaskSchema,
  updateTaskSchema,
  getTaskIdParamsSchema,
} = require('../validators/taskSchemas');

const isAdmin = (req) => req.user?.role === 'admin';

const createTask = async (req, res, next) => {
  try {
    const { error, value } = createTaskSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) throw new ApiError(400, 'Validation error', error.details);

    const task = await Task.create({
      ...value,
      user: req.user.id,
    });

    return res.status(201).json(task);
  } catch (err) {
    return next(err);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find(isAdmin(req) ? {} : { user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err) {
    return next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { error, value } = getTaskIdParamsSchema.validate(req.params, { abortEarly: false, stripUnknown: true });
    if (error) throw new ApiError(400, 'Validation error', error.details);

    const task = await Task.findById(value.id);
    if (!task) throw new ApiError(404, 'Task not found');

    if (!isAdmin(req) && task.user.toString() !== req.user.id) {
      throw new ApiError(403, 'Forbidden: insufficient permissions');
    }

    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { error: paramsError, value: paramsValue } = getTaskIdParamsSchema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (paramsError) throw new ApiError(400, 'Validation error', paramsError.details);

    const { error: bodyError, value } = updateTaskSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (bodyError) throw new ApiError(400, 'Validation error', bodyError.details);

    const task = await Task.findById(paramsValue.id);
    if (!task) throw new ApiError(404, 'Task not found');

    if (!isAdmin(req) && task.user.toString() !== req.user.id) {
      throw new ApiError(403, 'Forbidden: insufficient permissions');
    }

    Object.assign(task, value);
    await task.save();

    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { error, value } = getTaskIdParamsSchema.validate(req.params, { abortEarly: false, stripUnknown: true });
    if (error) throw new ApiError(400, 'Validation error', error.details);

    const task = await Task.findById(value.id);
    if (!task) throw new ApiError(404, 'Task not found');

    if (!isAdmin(req) && task.user.toString() !== req.user.id) {
      throw new ApiError(403, 'Forbidden: insufficient permissions');
    }

    await task.deleteOne();
    return res.status(200).json({ message: 'Task removed' });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};