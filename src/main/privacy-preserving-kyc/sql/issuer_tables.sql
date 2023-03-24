-- SQLite3 database schema for the issuer tables
CREATE TABLE Customer (
    username TEXT UNIQUE NOT NULL,
    password TEXT,
    name TEXT,
    passport_no TEXT,
    birth_date TEXT,
    nationality TEXT,
    register_time INTEGER
);

CREATE TABLE Connection (
    username TEXT NOT NULL,
    connection_id TEXT NOT NULL,
    invitation_url TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (username, connection_id)
);
