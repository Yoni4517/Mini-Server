const mysql = require('mysql2');
require('dotenv').config();
const genericAccess = require('../DBaccess/genericAccess');

const pool = mysql.createPool({
    host: process.env.HOST_NAME,
    password: process.env.PASSWORD,
    user: process.env.USER,
    database: process.env.DATABASE,
    port: process.env.PORT
});

exports.createNewTodo = (newTodoData) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                console.log(newTodoData);
                const { userId, title, completed } = newTodoData;
                const insertTodoQuery = 'INSERT INTO TODOS (userId, title, completed) VALUES (?, ?, ?)';
                connection.query(insertTodoQuery, [userId, title, completed], (err, result) => {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.getTodoById(result.insertId));
                    }
                });
            }
        });
    });
};

exports.updateTodo = (id, todoDetails) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                connection.release();
                reject(err);
            } else {
                const { userId, title, completed } = todoDetails;
                let updateValues = [];
                let updateColumns = [];

                if (userId) {
                    updateColumns.push('userId = ?');
                    updateValues.push(userId);
                }
                if (title) {
                    updateColumns.push('title = ?');
                    updateValues.push(title);
                }
                if (completed!=null) {
                    updateColumns.push('completed = ?');
                    updateValues.push(completed);
                }

                updateValues.push(parseInt(id)); // Add the ID to the update values

                const query = `UPDATE TODOS SET ${updateColumns.join(', ')} WHERE id = ?`;

                connection.query(query, updateValues, (error, results) => {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(this.getTodoById(id));
                    }
                });
            }
        });
    });
};

exports.getAllTodos = (searchObj) => {
    return genericAccess.getAll("TODOS", searchObj);
}

exports.getTodoById = (todoId) => {
    return genericAccess.getById(todoId, "TODOS");
}

exports.deleteTodo = (todoId) => {
    return genericAccess.deleteItem("TODOS", todoId)
}