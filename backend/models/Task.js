// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a task title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'in-progress', 'completed'],
                message: '{VALUE} is not a supported status',
            },
            default: 'pending',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        // RELATIONSHIP: Link task to a specific User
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dueDate: {
            type: Date,
        },
    },
    {
        // Automatically creates 'createdAt' and 'updatedAt' fields
        timestamps: true,
    }
);

// SCALABILITY TIP: Indexing
// We index the 'user' field because 90% of our queries will be 
// filtering tasks by the logged-in user ID.
taskSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);