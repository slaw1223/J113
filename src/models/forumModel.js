const {ObjectId} = require('mongodb');
const {getDB} = require('../data/connection');

async function getAll() {
    const db = getDB();
    const posts = await db.collection('posts').aggregate([
        {
            $lookup: {
                from: 'votes',
                localField: '_id',
                foreignField: 'postId',
                as: 'votes'
            }
        },
        {
            $addFields: {
                totalVotes: { $sum: '$votes.vote' }
            }
        },
        {
            $project: { votes: 0 }
        },
        { $sort: { createdAt: -1 } }
    ]).toArray();
    return posts;
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

async function addOrUpdateVote(postId, user, vote) {
    const db = getDB();
    await db.collection('votes').updateOne(
        { postId: new ObjectId(postId), user },
        { $set: { vote, createdAt: new Date() } },
        { upsert: true }
    );
}

async function getVoteForUser(postId, user) {
    const db = getDB();
    const voteDoc = await db.collection('votes').findOne({ postId: new ObjectId(postId), user });
    return voteDoc ? voteDoc.vote : 0;
}

async function getTotalVotesForPost(postId) {
    const db = getDB();
    const result = await db.collection('votes').aggregate([
        { $match: { postId: new ObjectId(postId) } },
        { $group: { _id: null, total: { $sum: '$vote' } } }
    ]).toArray();
    return result.length > 0 ? result[0].total : 0;
}

module.exports = { getAll, getPostById, addPost, updatePost, deletePost, addOrUpdateVote, getVoteForUser, getTotalVotesForPost };