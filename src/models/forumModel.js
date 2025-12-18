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

async function addPost(title, content, spoiler, owner) {
    const db = getDB();
    await db.collection('posts').insertOne({
        title,
        content,
        spoiler,
        owner: owner || null,
        createdAt: new Date()
    });
}
async function updatePost(id, title, content, spoiler, owner) {
    const db = getDB();
    const filter = owner ? {_id: new ObjectId(id), owner} : {_id: new ObjectId(id)};
    const res = await db.collection('posts').updateOne(filter, {$set: {title, content, spoiler}});
    return res.modifiedCount;
}
async function deletePost(id, owner) {
    const db = getDB();
    const filter = owner ? {_id: new ObjectId(id), owner} : {_id: new ObjectId(id)};
    const res = await db.collection('posts').deleteOne(filter);
    return res.deletedCount;
}
module.exports = { getAll, getPostById, addPost, updatePost, deletePost };