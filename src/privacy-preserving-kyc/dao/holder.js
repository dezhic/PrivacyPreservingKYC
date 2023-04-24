const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/holder.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the holder database.');
    }
});

module.exports = {

    createConnection: async function (connection_id, invitation_msg_id, their_public_did, their_did, my_did, created_at) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO Connection (connection_id, invitation_msg_id, their_public_did, their_did, my_did, created_at) VALUES (?,?,?,?,?,?)',
                [connection_id, invitation_msg_id, their_public_did, their_did, my_did, created_at], (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    },

    getConnections: async function () {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM Connection ORDER BY created_at DESC', (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    },

}
