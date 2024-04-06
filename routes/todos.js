const express = require('express');
const todosAccess = require('../DBaccess/todosAccess');
var url = require('url');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log("todos");
    var q = url.parse(req.url, true);
    todosAccess.getAllTodos(q.query)
        .then((results) => {
            console.log("All TODOS retrieved:", results);
            res.status(200).json(results);
        })
        .catch((err) => {
            console.error("Error retrieving all TODOS:", err);
            res.status(404).json({ error: "An error occurred while retrieving TODOS" });
        });
});

router.get('/:todoId', (req, res) => {
    const id = req.params.todoId;
    console.log("todos");
    todosAccess.getTodoById(id)
        .then((results) => {
            if (results.length == [])
                res.status(404).send("Todo not found");
            console.log(`TODO with id ${id} retrieved:`, results);
            res.status(200).json(results);
        })
        .catch((err) => {
            console.error(`Error retrieving todo with id ${id}:`, err);
            res.status(404).json({ error: `An error occurred while retrieving todo with id ${id}` });
        });
});

router.put('/:todoId', (req, res) => {
    const updatedTodoData = req.body;
    const todoId = req.params.todoId;
    todosAccess.updateTodo(todoId, updatedTodoData)
        .then(() => {
            todosAccess.getTodoById(todoId)
                .then((results) => {
                    if (results.length == [])
                        res.status(404).send("Todo not found");
                    console.log(`TODO with id ${todoId} retrieved:`, results);
                    res.status(200).json(results);
                })
                .catch((err) => {
                    console.error(`Error retrieving todo with id ${todoId}:`, err);
                    res.status(404).json({ error: `An error occurred while retrieving todo with id ${id}` });
                });
            console.log(`Todo with ID ${todoId} updated successfully`);
        })
        .catch((err) => {
            console.error('Error updating todo:', err);
            res.status(500).json({ error: 'An error occurred while updating the todo' });
        });
});

router.post('/', (req, res) => {
    const newTodoData = req.body;
    console.log(newTodoData);
    todosAccess.createNewTodo(newTodoData)
        .then((result) => {
            console.log("new todo created successfully");
            res.status(200).send(result)
        })
        .catch((err) => {
            console.error('Error creating new Todo:', err);
            res.status(500).json({ error: 'An error occurred while creating a new Todo' });
        });
});

router.delete('/:todoId', (req, res) => {
    const todoId = req.params.todoId;
    todosAccess.deleteTodo(todoId)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });

});

module.exports = router;