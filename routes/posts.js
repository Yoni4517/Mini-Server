const express = require('express');
const commentsRouter = require('./comments');
const postsAccess=require('../DBaccess/postsAccess');
var url = require('url');
const router = express.Router();

router.use('/:postId/comments',commentsRouter);

router.get('/', async (req, res) => {
    console.log("posts");
    var q = url.parse(req.url, true);
    postsAccess.getAllPosts(q.query)
    .then((results) => {
        console.log("All POSTS retrieved:", results);
        res.status(200).json(results);
    })
    .catch((err) => {
        console.error("Error retrieving all POSTS:", err);
        res.status(404).json({ error: "An error occurred while retrieving POSTS" });
    });
});

router.get('/:postId', (req, res) => {
    const id=req.params.postId;
    console.log("posts");
    postsAccess.getPostById(id)
    .then((results) => {
        if(results.length==[])
            res.status(404).send("Post not found");
        console.log(`POST with id ${id} retrieved:`, results);
        res.status(200).json(results);
    })
    .catch((err) => {
        console.error(`Error retrieving post with id ${id}:`, err);
        res.status(404).json({ error: `An error occurred while retrieving post with id ${id}` });
    });
});

router.put('/:postId', (req, res)=>{
    const updatedPostData = req.body;
    const postId = req.params.postId;
    postsAccess.updatePost(postId, updatedPostData)
        .then(() => {
            postsAccess.getPostById(postId)
            .then((results) => {
                if (results.length == [])
                    res.status(404).send("Post not found");
                console.log(`POST with id ${postId} retrieved:`, results);
                res.status(200).json(results);
            })
            .catch((err) => {
                console.error(`Error retrieving post with id ${postId}:`, err);
                res.status(404).json({ error: `An error occurred while retrieving post with id ${id}` });
            });
            console.log(`Post with ID ${postId} updated successfully`);
        })
        .catch((err) => {
            console.error('Error updating post:', err);
            res.status(500).json({ error: 'An error occurred while updating the post' });
        });
});

router.post('/', (req, res) => {
    const newPostData = req.body;
    console.log(newPostData);
    postsAccess.createNewPost(newPostData)
        .then((result) => {
            console.log("new post created successfully");
            res.status(200).send(result);
        })
        .catch((err) => {
            console.error('Error creating new Post:', err);
            res.status(500).json({ error: 'An error occurred while creating a new Post' });
        });
});

router.delete('/:postId', (req, res) => {
        const postId = req.params.postId;
        postsAccess.deletePost(postId)
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((error) => {
                res.status(500).send(error.message);
            });
});

module.exports = router;