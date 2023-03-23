-- SQLite3 database schema for the issuer tables
CREATE TABLE Customer (
    did TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT,
    name TEXT,
    passport_no TEXT,
    birth_date TEXT,
    nationality TEXT,
    register_time INTEGER
);
