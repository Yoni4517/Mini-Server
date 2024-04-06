const express = require('express');
const todosRouter = require('./todos');
const postsRouter = require('./posts');
const usersAccess = require('../DBaccess/usersAccess');
const passwordsAccess = require('../DBaccess/passwordsAccess')

const router = express.Router();

var url = require('url');

router.use('/:userId/todos', todosRouter);
router.use('/:userId/posts', postsRouter);


router.get('/', async (req, res) => {
    console.log("users");
    var q = url.parse(req.url, true);
    if (JSON.stringify(Object.keys(q.query)) === JSON.stringify(['email', 'password'])) {        console.log("hii");
        passwordsAccess.checkPassword(q.query)
            .then((results) => {
                if (results) {
                    console.log(true, results);
                    res.status(200).json(true);
                }
                else{
                    console.log(false, results);
                    res.status(200).json(false);
                }
            })
            .catch((err) => {
                console.error("Error checking password:", err);
                res.status(404).json({ error: "An error occurred while checking the password" });
            });
    }
    else {
        usersAccess.getAllUsers(q.query)
            .then((results) => {
                console.log("All USERS retrieved:", results);
                res.status(200).json(results);
            })
            .catch((err) => {
                console.error("Error retrieving all USERS:", err);
                res.status(404).json({ error: "An error occurred while retrieving USERS" });
            });
    }
});

router.get('/:userId', (req, res) => {
    const id = req.params.userId;
    console.log("users");
    usersAccess.getUserById(id)
        .then((results) => {
            if (results.length == [])
                res.status(404).send("User not found");
            console.log(`USER with id ${id} retrieved:`, results);
            res.status(200).json(results);
        })
        .catch((err) => {
            console.error(`Error retrieving user with id ${id}:`, err);
            res.status(404).json({ error: `An error occurred while retrieving user with id ${id}` });
        });
});

router.put('/:userId', (req, res) => {
    const updatedUserData = req.body;
    const userId = req.params.userId;
    usersAccess.updateUser(userId, updatedUserData)
        .then(() => {
            usersAccess.getUserById(userId)
                .then((results) => {
                    if (results.length == [])
                        res.status(404).send("User not found");
                    console.log(`USER with id ${userId} retrieved:`, results);
                    res.status(200).json(results);
                })
                .catch((err) => {
                    console.error(`Error retrieving user with id ${userId}:`, err);
                    res.status(404).json({ error: `An error occurred while retrieving user with id ${id}` });
                });
            console.log(`User with ID ${userId} updated successfully`);
        })
        .catch((err) => {
            console.error('Error updating user:', err);
            res.status(500).json({ error: 'An error occurred while updating the user' });
        });
});

router.post('/', (req, res) => {
    const newUserData = req.body;
    console.log(newUserData);
    usersAccess.createNewUser(newUserData)
        .then((result) => {
            console.log("new user created successfully");
            res.status(200).send(result)
        })
        .catch((err) => {
            console.error('Error creating new user:', err);
            res.status(500).json({ error: 'An error occurred while creating a new user' });
        });
});

router.delete('/:userId', (req, res) => {
    const userId = req.params.userId;
    usersAccess.deleteUser(userId)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

module.exports = router;