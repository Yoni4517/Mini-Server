const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.HOST_NAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});

exports.createNewPassword = (newPasswordData) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                console.log(newPasswordData);
                const {email, password}=newPasswordData;
                const insertPasswordQuery = 'INSERT INTO PASSWORDS (email, password) VALUES (?, ?)';

                connection.query(insertPasswordQuery, [email, password], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.updatePassword = (id, password) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                connection.release();
                reject(err);
            } else {
                const query = `UPDATE passwords SET password=? WHERE id = ?`;
                
                connection.query(query, password, id, (error, results) => {
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

exports.checkPassword = (passwordData) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                const { email, password } = passwordData;
                const selectPasswordQuery = `SELECT * FROM PASSWORDS WHERE email = '${email}' AND password = '${password}'`;
                connection.query(selectPasswordQuery, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.length > 0) {
                            resolve(results[0]);
                        } else {
                            resolve(null);
                        }
                    }
                    connection.release();
                });
            }
        });
    });
};
