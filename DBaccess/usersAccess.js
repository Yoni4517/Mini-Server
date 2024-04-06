const mysql = require('mysql2');
require('dotenv').config();
const genericAccess = require('../DBaccess/genericAccess');

const pool = mysql.createPool({
    host: process.env.HOST_NAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});

exports.createNewUser = (newUserData) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                console.log(newUserData);
                const { name, username, email, phone } = newUserData;
                const insertUserQuery = 'INSERT INTO USERS (name,username, email, phone) VALUES ( ?, ?, ?,?)';
            
                connection.query(insertUserQuery, [name, username, email, phone], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(result);
                        resolve(this.getUserById(result.insertId));
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.updateUser = (id, userDetails) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                connection.release();
                reject(err);
            } else {
                const { name, username, email, phone } = userDetails;

                let updateValues = [];
                let updateColumns = [];

                if (name) {
                    updateColumns.push('name = ?');
                    updateValues.push(name);
                }
                if (username) {
                    updateColumns.push('username = ?');
                    updateValues.push(username);
                }
                if (email) {
                    updateColumns.push('email = ?');
                    updateValues.push(email);
                }
                if (phone) {
                    updateColumns.push('phone = ?');
                    updateValues.push(phone);
                }

                updateValues.push(id); // Add the ID to the update values

                const query = `UPDATE users SET ${updateColumns.join(', ')} WHERE id = ?`;

                connection.query(query, updateValues, (error, results) => {
                    connection.release();

                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
};

exports.getAllUsers=(searchObj)=>{
    return genericAccess.getAll("USERS",searchObj);
}

exports.getUserById=(userId)=>{
    return genericAccess.getById(userId, "USERS");
}

exports.deleteUser=(userId)=>{
    return genericAccess.deleteItem("USERS", userId)
}