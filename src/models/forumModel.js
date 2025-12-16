const {ObjectId} = require('mongodb');
const {getDB} = require('../data/connection');

async function getAll() {
    const db = getDB();
    return await db.collection('posts').find().sort({createdAt: -1}).toArray();    
}
async function getPostById(id) {
    const db = getDB();
    return await db.collection('posts').findOne({_id: new ObjectId(id)});    
}
async function toggleSpoiler(spoiler) {
    const db = getDB();
    await db.collection('spoilers').updateOne(
        {$set: {spoiler}}
    );
}
async function addPost(title, content, spoiler) {
    const db = getDB();
    await db.collection('posts').insertOne({
        title,
        content,
        spoiler,
        createdAt: new Date()
    });
}
async function updatePost(id, title, content, spoiler) {
    const db = getDB();
    await db.collection('posts').updateOne(
        {_id: new ObjectId(id)},
        {$set: {title, content, spoiler}}
    );
}
async function deletePost(id) {
    const db = getDB();
    await db.collection('posts').deleteOne({_id: new ObjectId(id)});
}
module.exports = { getAll, getPostById, addPost, updatePost, deletePost, toggleSpoiler };