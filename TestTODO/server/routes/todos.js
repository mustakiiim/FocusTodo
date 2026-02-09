import express from 'express';
import Todo from '../models/Todo.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/todos
// @desc    Get all todos for user
// @access  Private
router.get('/', protect, async (req, res) => {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
});

// @route   POST /api/todos
// @desc    Create a todo
// @access  Private
router.post('/', protect, async (req, res) => {
    const { text, description, priority, dueDate } = req.body;

    const todo = new Todo({
        user: req.user._id,
        text,
        description,
        priority,
        dueDate,
    });

    const createdTodo = await todo.save();
    res.status(201).json(createdTodo);
});

// @route   PUT /api/todos/:id
// @desc    Update a todo
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (todo) {
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        todo.text = req.body.text || todo.text;
        todo.description = req.body.description !== undefined ? req.body.description : todo.description;
        todo.priority = req.body.priority || todo.priority;
        todo.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : todo.dueDate;
        todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

// @route   DELETE /api/todos/:id
// @desc    Delete a todo
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (todo) {
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await todo.deleteOne();
        res.json({ message: 'Todo removed' });
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

export default router;
