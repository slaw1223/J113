const forumModel = require('../models/forumModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

async function getAll(req, res) {
    const posts = await forumModel.getAll();
    const user = req.session.user;
    const sortBy = req.query.sortBy || 'newest';
    
    if (sortBy === 'newest') {
        posts.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'oldest') {
        posts.sort((a, b) => a.createdAt - b.createdAt);
    }
    else if (sortBy === 'mostVoted') {
        posts.sort((a, b) => b.totalVotes - a.totalVotes);
    }else if (sortBy === 'leastVoted') {
        posts.sort((a, b) => a.totalVotes - b.totalVotes);
    }
    if (user) {
        for (const post of posts) {
            post.userVote = await forumModel.getVoteForUser(post._id, user);
        }
    }
    const hideSpoilers = req.query.hideSpoilers === 'true';
    res.render('pages/index', { posts, user, hideSpoilers, sortBy });
}
async function getPostById(req, res) {
    const user = req.session.user;
    const post = await forumModel.getPostById(req.params.id);
    res.render('pages/post', { post, user });
}
function getAddForm(req, res) {
    if (!req.session.user) return res.redirect('/logIn');
    res.render('pages/new', { user: req.session.user });
}
async function postAdd(req, res) {
    const user = req.session.user;
    if (!user) return res.redirect('/logIn');
    const { title, content, spoiler } = req.body;
    if(title.trim().length < 1 || content.trim().length < 1) {
        return res.status(403).send('Tytuł i treść nie mogą być puste')
    }
    await forumModel.addPost(title, content, spoiler, user);
    res.redirect('/');
}
async function getEditForm(req, res) {
    const user = req.session.user;
    if (!user) return res.redirect('/logIn');
    const post = await forumModel.getPostById(req.params.id);
    if (!post || (post.owner !== user && user !== 'slawkolo')) return res.status(403).send('Nie możesz edytować');
    res.render('pages/edit', { post, user });
}
async function postEdit(req ,res) {
    const user = req.session.user;
    if (!user) return res.redirect('/logIn');
    const { title, content, spoiler } = req.body;
    const isAdmin = user === 'slawkolo';
    if(title.trim().length < 1 || content.trim().length < 1) {
        return res.status(403).send('Tytuł i treść nie mogą być puste');
    }
    const modified = await forumModel.updatePost(req.params.id, title, content, spoiler, isAdmin ? null : user);
    if (!modified) return res.status(403).send('Nie jesteś właścicielem tego posta');
    res.redirect('/');
}
async function deletePost(req, res) {
    const user = req.session.user;
    if (!user) return res.redirect('/logIn');
    const isAdmin = user === 'slawkolo';
    const deleted = await forumModel.deletePost(req.params.id, isAdmin ? null : user);
    if (!deleted) return res.status(403).send('Nie jesteś właścicielem tego posta');
    res.redirect('/');
}
async function getLogInForm(req, res) {
    res.render('pages/logIn', { post: {} });
}
async function postLogIn(req, res) {
    const { login, password } = req.body;
    if (!login || !password) return res.render('pages/logIn', { error: 'Brak danych' });
    const user = await userModel.findByLogin(login);
    if (!user) return res.render('pages/logIn', { error: 'Nieprawidłowy login lub hasło' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.render('pages/logIn', { error: 'Nieprawidłowy login lub hasło' });
    req.session.user = login;
    res.redirect('/');
}
async function getCreateAccountForm(req, res) {
    res.render('pages/createAccount', { post: {} });
}
async function postCreateAccount(req, res) {
    const { login, password } = req.body;
    if (!login || !password) return res.render('pages/createAccount', { error: 'Brak danych' });
    const existing = await userModel.findByLogin(login);
    if (existing) return res.render('pages/createAccount', { error: 'Użytkownik już istnieje' });
    const hash = await bcrypt.hash(password, 10);
    await userModel.addUser(login, hash);
    req.session.user = login;
    res.redirect('/');
}

async function postVote(req, res) {
    const user = req.session.user;
    if (!user) return res.redirect('/logIn');
    const { postId } = req.params;
    const { vote } = req.body;
    if (vote !== '1' && vote !== '-1') return res.status(400).send('Nieprawidłowy głos');
    await forumModel.addOrUpdateVote(postId, user, parseInt(vote));
    res.redirect('/');
}

async function getVote(req, res) {
    try {
        const { user } = req.query;
        const { postId } = req.params;
        if (!user) return res.json({ vote: 0 });
        const vote = await forumModel.getVoteForUser(postId, user);
        return res.json({ vote });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'Błąd serwera' });
    }
}

module.exports = { getAll, getAddForm, postAdd, getEditForm, postEdit, deletePost, getPostById, getLogInForm, postLogIn, getCreateAccountForm, postCreateAccount, postVote};