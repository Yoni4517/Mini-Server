const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.HOST_NAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});

exports.createDB = () => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'users'", (err, rows) => {
            if (err) throw err;
            if (rows.length > 0) {
                console.log("Database already exists");
                connection.release();
            } else {
                connection.query("CREATE DATABASE users", (err) => {
                    if (err) throw err;
                    console.log("Database created");
                    connection.release();
                });
            }
        });
    });
}

exports.createUsersTable = () => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS USERS (
              id INT PRIMARY KEY AUTO_INCREMENT,
              name VARCHAR(255) NOT NULL,
              username VARCHAR(255) NOT NULL,
              phone VARCHAR(255) NOT NULL,
              email VARCHAR(255) UNIQUE NOT NULL
              )
      `;

        connection.query('SHOW TABLES LIKE "USERS"', (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                console.log("Table USERS already exists");
                connection.release();
            } else {
                connection.query(createTableQuery, (err) => {
                    if (err) throw err;
                    console.log("Table USERS created");
                    connection.release();
                });
            }
        });
    });
}

exports.createPostsTable = () => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS POSTS (
              id INT PRIMARY KEY AUTO_INCREMENT,
              userId INT,
              title VARCHAR(255),
              body VARCHAR(255),
              FOREIGN KEY (userId) REFERENCES USERS(id) ON DELETE CASCADE
          )
      `;

        connection.query('SHOW TABLES LIKE "POSTS"', (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                console.log("Table POSTS already exists");
                connection.release();
            } else {
                connection.query(createTableQuery, (err) => {
                    if (err) throw err;
                    console.log("Table POSTS created");
                    connection.release();
                });
            }
        });
    });
}

exports.createTodosTable = () => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS TODOS (
                id INT PRIMARY KEY AUTO_INCREMENT,
                userId INT,
                title VARCHAR(255),
                completed BOOLEAN,
                FOREIGN KEY (userId) REFERENCES USERS(id) ON DELETE CASCADE
            )
        `;

        connection.query('SHOW TABLES LIKE "TODOS"', (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                console.log("Table TODOS already exists");
                connection.release();
            } else {
                connection.query(createTableQuery, (err) => {
                    if (err) throw err;
                    console.log("Table TODOS created");
                    connection.release();
                });
            }
        });
    });
}

exports.createCommentsTable = () => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS COMMENTS (
                id INT PRIMARY KEY AUTO_INCREMENT,
                postId INT,
                name VARCHAR(255),
                email VARCHAR(255),
                body VARCHAR(255),
                FOREIGN KEY (postId) REFERENCES POSTS(id) ON DELETE CASCADE
            )
            `;

        connection.query('SHOW TABLES LIKE "COMMENTS"', (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                console.log("Table COMMENTS already exists");
                connection.release();
            } else {
                connection.query(createTableQuery, (err) => {
                    if (err) throw err;
                    console.log("Table COMMENTS created");
                    connection.release();
                });
            }
        });
    });
}

exports.createPasswordsTable = () => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS PASSWORDS (
                email VARCHAR(255) PRIMARY KEY,
                password VARCHAR(255),
                FOREIGN KEY (email) REFERENCES USERS(email) ON DELETE CASCADE
            )
            `;

        connection.query('SHOW TABLES LIKE "PASSWORDS"', (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                console.log("Table PASSWORDS already exists");
                connection.release();
            } else {
                connection.query(createTableQuery, (err) => {
                    if (err) throw err;
                    console.log("Table PASSWORDS created");
                    connection.release();
                });
            }
        });
    });
}


exports.resetDB = () => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query('SHOW DATABASES LIKE ?', [connection.config.database], (err, result) => {
            if (err) {
                console.error('Error checking database existence:', err);
                connection.release();
                return;
            }

            if (result.length === 0) {
                console.log('Database does not exist');
                connection.release();
            } else {
                deleteTables(connection);
            }
        });
    });
    function deleteTables(connection) {
        const disableForeignKeyCheckQuery = 'SET FOREIGN_KEY_CHECKS = 0';
        const enableForeignKeyCheckQuery = 'SET FOREIGN_KEY_CHECKS = 1';
        const tablesQuery = 'SHOW TABLES';

        connection.query(disableForeignKeyCheckQuery, (err) => {
            if (err) {
                console.error('Error disabling foreign key checks:', err);
                connection.release();
                return;
            }

            connection.query(tablesQuery, (err, tables) => {
                if (err) {
                    console.error('Error fetching tables:', err);
                    connection.release();
                    return;
                }

                tables.forEach((table) => {
                    const tableName = Object.values(table)[0];
                    const dropTableQuery = `DROP TABLE IF EXISTS \`${tableName}\``;

                    connection.query(dropTableQuery, (err) => {
                        if (err) {
                            console.error(`Error dropping table ${tableName}:`, err);
                            return;
                        }
                        console.log(`Dropped table: ${tableName}`);
                    });
                });

                connection.query(enableForeignKeyCheckQuery, (err) => {
                    if (err) {
                        console.error('Error enabling foreign key checks:', err);
                    }
                    connection.release();
                });
            });
        });
    }
}

exports.updateDB=async()=>{
    await DB.resetDB();
    await DB.createUsersTable();
    DB.createTodosTable();
    await DB.createPostsTable();
    DB.createCommentsTable();
    DB.createPasswordsTable();  
}
