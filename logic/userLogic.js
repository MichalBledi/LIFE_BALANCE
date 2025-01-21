/*import db from '../database/db.js';*/

export const getUsers = (callback) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

export const addUser = (username, firstName, lastName, password, birthDate, callback) => {
    db.query(
        'INSERT INTO users (username, firstName, lastName, password, birthDate) VALUES (?, ?, ?, ?, ?)',
        [username, firstName, lastName, password, birthDate],
        (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results);
            }
        }
    );
};

export const checkUsernameAvailability = (username, callback) => {
    db.query('SELECT username FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results.length === 0);
        }
    });
};

export const loginUser = (username, password, callback) => {
    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                callback(err, null);
            } else if (results.length === 0) {
                callback(null, null);
            } else {
                callback(null, results[0]);
            }
        }
    );
};
