const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Define routes
router.get('/', todoController.getAllTodos);
router.post('/', todoController.createTodo);
router.get('/:id', todoController.getTodoById);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

// Define Todo Item routes
router.get('/:id/items/:iid', todoController.getTodoItemById);
router.post('/:id/items', todoController.createTodoItem);
router.put('/:id/items/:iid', todoController.updateTodoItem);
router.delete('/:id/items/:iid', todoController.deleteTodoItem);

module.exports = router;
