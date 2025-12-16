const forumModel = require('../models/forumModel');

async function getAll(req, res) {
    const posts = await forumModel.getAll();
    res.render('pages/index', { posts });
}
async function getPostById(req, res) {
    const post = await forumModel.getPostById(req.params.id);
    res.render('pages/post', { post });
}
async function toggleSpoiler(req, res) {
    const { spoiler } = req.body;
    await forumModel.toggleSpoiler(spoiler);
    res.redirect('/');
}
function getAddForm(req, res) {
    res.render('pages/new');
}
async function postAdd(req, res) {
    const { title, content, spoiler } = req.body;
    await forumModel.addPost(title, content, spoiler);
    res.redirect('/');
}
async function getEditForm(req, res) {
    const post = await forumModel.getPostById(req.params.id);
    res.render('pages/edit', { post });    
}
async function postEdit(req ,res) {
    const { title, content, spoiler } = req.body;
    await forumModel.updatePost(req.params.id, title, content, spoiler);
    res.redirect('/');
}
async function deletePost(req, res) {
    await forumModel.deletePost(req.params.id);
    res.redirect('/');
}

module.exports = { getAll, getAddForm, postAdd, getEditForm, postEdit, deletePost, getPostById, toggleSpoiler };