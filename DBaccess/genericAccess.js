const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.HOST_NAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});


exports.getById = (id, table) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                const query = `SELECT * FROM ${table} WHERE id=${id}`;
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results[0]);
                        connection.release();
                    }
                });
            }
        });
    });
}


exports.getAll = (table, searchParams) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                let query = `SELECT * FROM ${table}`;

                if (searchParams && Object.keys(searchParams).length > 0) {
                    const conditions = Object.keys(searchParams).map(key => `${key} = ?`).join(' AND ');
                    query += ` WHERE ${conditions}`;
                }

                connection.query(query, Object.values(searchParams), (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        connection.release();
                        resolve(results);
                    }
                });
            }
        });
    });
}


exports.deleteItem = (table, id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                const query = `DELETE FROM ${table} WHERE id = ?`;
                
                connection.query(query, [id], (error, results) => {
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


