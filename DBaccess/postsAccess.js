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

exports.createNewPost = (newPostData) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                console.log(newPostData);
                const {userId,title, body}=newPostData;
                const insertPostQuery = 'INSERT INTO POSTS (userId,title, body) VALUES (?, ?, ?)';

                connection.query(insertPostQuery, [userId,title, body], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.getPostById(result.insertId));
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.updatePost = (id, postDetails) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                connection.release();
                reject(err);
            } else {
                const { userId, title, body } = postDetails;
                
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
                if (body) {
                    updateColumns.push('body = ?');
                    updateValues.push(body);
                }
                
                updateValues.push(id); // Add the ID to the update values
                
                const query = `UPDATE POSTS SET ${updateColumns.join(', ')} WHERE id = ?`;
                
                connection.query(query, updateValues, (error, results) => {
                    connection.release();

                    if (error) {
                        reject(error);
                    } else {
                        resolve(this.getPostById(id));
                    }
                });
            }
        });
    });
};

exports.getAllPosts=(searchObj)=>{
    return genericAccess.getAll("POSTS",searchObj);
}

exports.getPostById=(postId)=>{
    return genericAccess.getById(postId, "POSTS");
}

exports.deletePost=(postId)=>{
    return genericAccess.deleteItem("POSTS", postId)
}