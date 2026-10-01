-- DROP DATABASE IF EXISTS currencyDB;
-- CREATE DATABASE currencyDB;
--
-- USE currencyDB;

CREATE TABLE currency (
    cid INT PRIMARY KEY AUTO_INCREMENT,
    currency_code VARCHAR(3) UNIQUE NOT NULL,
    currency_name VARCHAR(50) NOT NULL,
    currency_symbol VARCHAR(5)
);

CREATE TABLE conversion_history (
    hid INT PRIMARY KEY AUTO_INCREMENT,
    from_currency_id INT NOT NULL,
    to_currency_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    exchange_rate DECIMAL(10,5) NOT NULL,
    converted_amount DECIMAL(10,2) NOT NULL,
    conversion_date DATETIME NOT NULL,

    CONSTRAINT fk_history_from_currency
        FOREIGN KEY (from_currency_id)
        REFERENCES currency(cid),

    CONSTRAINT fk_history_to_currency
        FOREIGN KEY (to_currency_id)
        REFERENCES currency(cid)
);

CREATE TABLE favourites (
    wid INT PRIMARY KEY AUTO_INCREMENT,
    from_currency_id INT NOT NULL,
    to_currency_id INT NOT NULL,

    CONSTRAINT fk_favourites_from_currency
        FOREIGN KEY (from_currency_id)
        REFERENCES currency(cid),

    CONSTRAINT fk_favourites_to_currency
        FOREIGN KEY (to_currency_id)
        REFERENCES currency(cid),

    CONSTRAINT uq_favourite_pair
        UNIQUE (from_currency_id, to_currency_id)
);
