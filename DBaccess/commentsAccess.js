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

exports.createNewComment = (newCommentData) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                console.log(newCommentData);
                const {postId, name, email, body } = newCommentData;
                const insertCommentQuery = 'INSERT INTO COMMENTS (postId, name, email, body) VALUES ( ?, ?, ?,?)';

                connection.query(insertCommentQuery, [ postId, name, email, body], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.getCommentById(result.insertId));
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.updateComment = (id, commentDetails) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                connection.release();
                reject(err);
            } else {
                const { postId,name, email, body } = commentDetails;
                
                let updateValues = [];
                let updateColumns = [];
                if (postId) {
                    updateColumns.push('postId = ?');
                    updateValues.push(postId);
                }
                if (name) {
                    updateColumns.push('name = ?');
                    updateValues.push(name);
                }
                if (email) {
                    updateColumns.push('email = ?');
                    updateValues.push(email);
                }
                if (body) {
                    updateColumns.push('body = ?');
                    updateValues.push(body);
                }
                
                updateValues.push(id); // Add the ID to the update values
                
                const query = `UPDATE COMMENTS SET ${updateColumns.join(', ')} WHERE id = ?`;
                
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

exports.getAllComments=(searchObj)=>{
    return genericAccess.getAll("COMMENTS",searchObj);
}

exports.getCommentById=(commentsId)=>{
    return genericAccess.getById(commentsId, "COMMENTS");
}

exports.deleteComment=(commentsId)=>{
    return genericAccess.deleteItem("COMMENTS", commentsId)
}