const DB = require('./createDB');
const express=require('express');
require('dotenv').config();
const cors = require('cors');
const usersRouter = require('./routes/users');
const todosRouter = require('./routes/todos');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');


const host=process.env.HOST;
const port=2024;

const server=express();

server.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}));

server.use(express.json());

server.use('/users', usersRouter);
server.use('/posts', postsRouter);
server.use('/todos', todosRouter);
server.use('/comments', commentsRouter);


server.listen(port, host, () => {
    console.log(`listening to requests at http://${host}:${port}`);
});


//DB.updateDB();