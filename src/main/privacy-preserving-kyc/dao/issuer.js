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

    getLastConnection: async function (username) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM Connection WHERE username = ? ORDER BY created_at DESC LIMIT 1', [username], (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row);
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

}
