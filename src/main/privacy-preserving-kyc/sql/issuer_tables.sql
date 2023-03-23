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

INSERT INTO Customer VALUES ('alice', 'alicepw', 'Alice', 'A12345678', '1990-01-01', 'China', 0);