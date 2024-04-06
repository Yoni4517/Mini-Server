const express = require('express');
const commentsAccess=require('../DBaccess/commentsAccess');
var url = require('url');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log("comments");
    var q = url.parse(req.url, true);
    commentsAccess.getAllComments(q.query)
    .then((results) => {
        console.log("All COMMENTS retrieved:", results);
        res.status(200).json(results);
    })
    .catch((err) => {
        console.error("Error retrieving all COMMENTS:", err);
        res.status(404).json({ error: "An error occurred while retrieving COMMENTS" });
    });
});

router.get('/:commentId', (req, res) => {
    const id=req.params.commentId;
    console.log("comment");
    commentsAccess.getCommentById(id)
    .then((results) => {
        if(results.length==[])
            res.status(404).send("Comment not found");
        console.log(`COMMENT with id ${id} retrieved:`, results);
        res.status(200).json(results);
    })
    .catch((err) => {
        console.error(`Error retrieving comment with id ${id}:`, err);
        res.status(404).json({ error: `An error occurred while retrieving comment with id ${id}` });
    });
});

router.put('/:commentId', (req, res)=>{
    const updatedCommentData = req.body;
    const commentId = req.params.commentId;
    commentsAccess.updateComment(commentId, updatedCommentData)
        .then(() => {
            commentsAccess.getCommentById(commentId)
            .then((results) => {
                if (results.length == [])
                    res.status(404).send("Comment not found");
                console.log(`COMMENT with id ${commentId} retrieved:`, results);
                res.status(200).json(results);
            })
            .catch((err) => {
                console.error(`Error retrieving comment with id ${commentId}:`, err);
                res.status(404).json({ error: `An error occurred while retrieving comment with id ${id}` });
            });
            console.log(`Comment with ID ${commentId} updated successfully`);
        })
        .catch((err) => {
            console.error('Error updating comment:', err);
            res.status(500).json({ error: 'An error occurred while updating the comment' });
        });
});

router.post('/', (req, res) => {
    const newCommentData = req.body;
    console.log(newCommentData);
    commentsAccess.createNewComment(newCommentData)
        .then((result) => {
            console.log("new comment created successfully");
            res.status(200).send(result)
        })
        .catch((err) => {
            console.error('Error creating new comment:', err);
            res.status(500).json({ error: 'An error occurred while creating a new comment' });
        });
});

router.delete('/:commentId', (req, res) => {
    const commentId = req.params.commentId;
    commentsAccess.deleteComment(commentId)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

module.exports = router;