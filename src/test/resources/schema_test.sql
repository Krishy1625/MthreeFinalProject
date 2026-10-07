-- DROP DATABASE IF EXISTS currencyDB_test;
-- CREATE DATABASE currencyDB_test;
--
-- USE currencyDB_test;

CREATE TABLE users (
    uid INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE currency (
    cid INT PRIMARY KEY AUTO_INCREMENT,
    currency_code VARCHAR(3) UNIQUE NOT NULL,
    currency_name VARCHAR(50) NOT NULL,
    currency_symbol VARCHAR(5)
);

CREATE TABLE conversion_history (
    hid INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    from_currency_id INT NOT NULL,
    to_currency_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    exchange_rate DECIMAL(10,5) NOT NULL,
    converted_amount DECIMAL(10,2) NOT NULL,
    conversion_date DATETIME NOT NULL,
    notes VARCHAR(255),

    CONSTRAINT fk_history_user_id
        FOREIGN KEY (user_id) REFERENCES users(uid),

    CONSTRAINT fk_history_from_currency
        FOREIGN KEY (from_currency_id) REFERENCES currency(cid),

    CONSTRAINT fk_history_to_currency
        FOREIGN KEY (to_currency_id) REFERENCES currency(cid)
);

CREATE TABLE favourites (
    fid INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    from_currency_id INT NOT NULL,
    to_currency_id INT NOT NULL,

    CONSTRAINT fk_favourites_user_id
        FOREIGN KEY (user_id) REFERENCES users(uid),

    CONSTRAINT fk_favourites_from_currency
        FOREIGN KEY (from_currency_id) REFERENCES currency(cid),

    CONSTRAINT fk_favourites_to_currency
        FOREIGN KEY (to_currency_id) REFERENCES currency(cid),

    CONSTRAINT uq_favourite_pair
        UNIQUE (user_id, from_currency_id, to_currency_id)
);