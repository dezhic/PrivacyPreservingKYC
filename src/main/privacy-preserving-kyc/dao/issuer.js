const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/issuer.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the issuer database.');
    }
});

module.exports = {
    getCustomerByUsername: async function (username) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM Customer WHERE username = ?', [username], (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
    },

    createCustomer: async function (username, password, name, passport_no, birth_date, nationality, register_time) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO Customer (username, password, name, passport_no, birth_date, nationality, register_time) VALUES (?,?,?,?,?,?,?)',
                [username, password, name, passport_no, birth_date, nationality, register_time], (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    },

    createConnection: async function (username, connection_id, invitation_url, created_at) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO Connection (username, connection_id, invitation_url, created_at) VALUES (?,?,?,?)',
                [username, connection_id, invitation_url, created_at], (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    },

    getConnectionsByUsername: async function (username) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM Connection WHERE username = ? ORDER BY created_at DESC', [username], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    },

    getConnectionByUsernameAndConnectionId: async function (username, connection_id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM Connection WHERE username = ? AND connection_id = ?', [username, connection_id], (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
    },

    createCredentialInfo: async function (credExId, connectionId, holderDid, username, type, content, createdAt) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO CredentialInfo (cred_ex_id, connection_id, holder_did, username, type, content, created_at) VALUES (?,?,?,?,?,?,?)',
                [credExId, connectionId, holderDid, username, type, content, createdAt], (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                }
            );
        });
    },

    getCredentialInfoByUsername: async function (username) {
        return new Promise((resolve, reject) => {
            console.log("getting all credentials for user: " + username + "...");
            db.all('SELECT * FROM CredentialInfo WHERE username = ? ORDER BY created_at DESC', [username], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    },

    getCustomers: async function () {
        return new Promise((resolve, reject) => {
            db.all('SELECT cred.holder_did AS did, cust.name AS name, nationality, passport_no, birth_date FROM Customer cust JOIN Connection conn ON cust.username = conn.username JOIN CredentialInfo cred ON conn.connection_id = cred.connection_id ORDER BY cred.created_at DESC', (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    },

}
