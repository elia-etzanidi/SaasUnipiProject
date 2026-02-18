const prisma = require('../../lib/prisma');

// List all todos for the authenticated user
exports.getAllTodos = async (req, res) => {
    try {
        const userId = req.user.id;
        const todos = await prisma.todo.findMany({
            where: {
                user_id: userId
            },
            include: {
                items: true
            }
        });
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new todo
exports.createTodo = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const newTodo = await prisma.todo.create({
            data: {
                name,
                user_id: userId,
                completed: false
            }
        });

        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a todo by ID
exports.getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const todo = await prisma.todo.findFirst({
            where: {
                id: id,
                user_id: userId
            },
            include: {
                items: true
            }
        });

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json(todo);
    } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a todo by ID
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, completed } = req.body;
        const userId = req.user.id;

        const existingTodo = await prisma.todo.findFirst({
            where: {
                id: id,
                user_id: userId
            }
        });

        if (!existingTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        const updatedTodo = await prisma.todo.update({
            where: {
                id: id
            },
            data: {
                name: name !== undefined ? name : existingTodo.name,
                completed: completed !== undefined ? completed : existingTodo.completed
            }
        });

        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a todo by ID
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const existingTodo = await prisma.todo.findFirst({
            where: {
                id: id,
                user_id: userId
            }
        });

        if (!existingTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        await prisma.todo.delete({
            where: {
                id: id
            }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new todo item
exports.createTodoItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.user.id;

        const todo = await prisma.todo.findFirst({
            where: { id: id, user_id: userId }
        });

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Item name is required' });
        }

        const newItem = await prisma.todoItem.create({
            data: {
                name,
                todo_id: id
            }
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating todo item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a specific todo item
exports.getTodoItemById = async (req, res) => {
    try {
        const { id, iid } = req.params;
        const userId = req.user.id;

        const item = await prisma.todoItem.findFirst({
            where: {
                id: iid,
                todo_id: id,
                todo: {
                    user_id: userId
                }
            }
        });

        if (!item) {
            return res.status(404).json({ error: 'Todo item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error('Error fetching todo item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a todo item
exports.updateTodoItem = async (req, res) => {
    try {
        const { id, iid } = req.params;
        const { name, completed } = req.body;
        const userId = req.user.id;

        const existingItem = await prisma.todoItem.findFirst({
            where: {
                id: iid,
                todo_id: id,
                todo: {
                    user_id: userId
                }
            }
        });

        if (!existingItem) {
            return res.status(404).json({ error: 'Todo item not found' });
        }

        const updatedItem = await prisma.todoItem.update({
            where: { id: iid },
            data: {
                name: name !== undefined ? name : existingItem.name,
                completed: completed !== undefined ? completed : existingItem.completed
            }
        });

        res.json(updatedItem);
    } catch (error) {
        console.error('Error updating todo item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a todo item
exports.deleteTodoItem = async (req, res) => {
    try {
        const { id, iid } = req.params;
        const userId = req.user.id;

        const existingItem = await prisma.todoItem.findFirst({
            where: {
                id: iid,
                todo_id: id,
                todo: {
                    user_id: userId
                }
            }
        });

        if (!existingItem) {
            return res.status(404).json({ error: 'Todo item not found' });
        }

        await prisma.todoItem.delete({
            where: { id: iid }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting todo item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
