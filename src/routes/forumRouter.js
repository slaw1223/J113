const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.get('/', forumController.getAll);
router.get('/', forumController.toggleSpoiler);
router.get('/new', forumController.getAddForm);
router.post('/new', forumController.postAdd);
router.get('/edit/:id', forumController.getEditForm);
router.post('/edit/:id', forumController.postEdit);
router.post('/delete/:id', forumController.deletePost);
router.get('/:id', forumController.getPostById);
module.exports = router;