const forumModel = require('../models/forumModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

async function getAll(req, res) {
    const posts = await forumModel.getAll();
    res.render('pages/index', { posts });
}
async function getPostById(req, res) {
    const post = await forumModel.getPostById(req.params.id);
    res.render('pages/post', { post });
}
function getAddForm(req, res) {
    res.render('pages/new');
}
async function postAdd(req, res) {
    const { title, content, spoiler, owner, user } = req.body;
    const author = owner || user || null;
    if (!author) return res.status(401).json({ success: false, message: 'Musisz być zalogowany by tworzyć posty' });
    await forumModel.addPost(title, content, spoiler, author);
    return res.json({ success: true });
}
async function getEditForm(req, res) {
    const post = await forumModel.getPostById(req.params.id);
    res.render('pages/edit', { post });    
}
async function postEdit(req ,res) {
    const { title, content, spoiler, owner, user } = req.body;
    const author = owner || user || null;
    if (!author) return res.status(401).json({ success: false, message: 'Musisz być zalogowany by edytować posty' });
    const isAdmin = author === 'slawkolo';
    const modified = await forumModel.updatePost(req.params.id, title, content, spoiler, isAdmin ? null : author);
    if (!modified) return res.status(403).json({ success: false, message: 'Nie jesteś właścicielem tego posta' });
    return res.json({ success: true });
}
async function deletePost(req, res) {
    const { owner, user } = req.body;
    const author = owner || user || null;
    if (!author) return res.status(401).json({ success: false, message: 'Musisz być zalogowany by usuwać posty' });
    const isAdmin = author === 'slawkolo';
    const deleted = await forumModel.deletePost(req.params.id, isAdmin ? null : author);
    if (!deleted) return res.status(403).json({ success: false, message: 'Nie jesteś właścicielem tego posta' });
    return res.json({ success: true });
}
async function getLogInForm(req, res) {
    res.render('pages/logIn', { post: {} });
}
async function postLogIn(req, res) {
    try {
        const { login, password } = req.body;
        if (!login || !password) return res.status(400).json({ success: false, message: 'Brak danych' });
        const user = await userModel.findByLogin(login);
        if (!user) return res.status(400).json({ success: false, message: 'Nieprawidłowy login lub hasło' });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ success: false, message: 'Nieprawidłowy login lub hasło' });
        return res.json({ success: true, username: user.login });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'Błąd serwera' });
    }
}
async function getCreateAccountForm(req, res) {
    res.render('pages/createAccount', { post: {} });
}
async function postCreateAccount(req, res) {
    try {
        const { login, password } = req.body;
        if (!login || !password) return res.status(400).json({ success: false, message: 'Brak danych' });
        const existing = await userModel.findByLogin(login);
        if (existing) return res.status(400).json({ success: false, message: 'Użytkownik już istnieje' });
        const hash = await bcrypt.hash(password, 10);
        await userModel.addUser(login, hash);
        return res.json({ success: true, username: login });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'Błąd serwera' });
    }
}

module.exports = { getAll, getAddForm, postAdd, getEditForm, postEdit, deletePost, getPostById, getLogInForm, postLogIn, getCreateAccountForm, postCreateAccount};