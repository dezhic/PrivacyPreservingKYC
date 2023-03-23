-- SQLite3 database schema for the issuer tables
CREATE TABLE Customer (
    did TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT,
    name TEXT,
    address TEXT,
    passport_no TEXT,
    balance INTEGER,
    register_time INTEGER
);
