const { getDB } = require('../data/connection');
const bcrypt = require('bcryptjs');

async function findByLogin(login) {
    const db = getDB();
    return await db.collection('users').findOne({ login });
}

async function addUser(login, passwordHash) {
    const db = getDB();
    await db.collection('users').insertOne({ login, password: passwordHash, createdAt: new Date() });
}

async function ensureAdminExists() {
    const adminLogin = 'slawkolo';
    const adminPassword = 'slawkolo';
    const existing = await findByLogin(adminLogin);
    if (!existing) {
        const hash = await bcrypt.hash(adminPassword, 10);
        await addUser(adminLogin, hash);
        console.log('Admin account created: slawkolo');
    }
}

module.exports = { findByLogin, addUser, ensureAdminExists };