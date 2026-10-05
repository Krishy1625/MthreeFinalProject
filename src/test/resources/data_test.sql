-- USE currencyDB_test;

INSERT INTO users (username, password_hash)
VALUES
    ('testuser1', 'hashedpassword1'),
    ('testuser2', 'hashedpassword2');

INSERT INTO currency (currency_code, currency_name, currency_symbol)
VALUES
    ('GBP', 'British Pound', '£'),
    ('EUR', 'Euro', '€'),
    ('USD', 'US Dollar', '$'),
    ('JPY', 'Japanese Yen', '¥');

INSERT INTO favourites (user_id, from_currency_id, to_currency_id)
VALUES
    (1, 1, 2),
    (1, 1, 3),
    (2, 3, 4);

INSERT INTO conversion_history
(user_id, from_currency_id, to_currency_id, amount, exchange_rate,
 converted_amount, conversion_date, notes)
VALUES
    (1, 1, 2, 100.00, 1.15000, 115.00, '2026-10-01 10:00:00', 'Holiday'),
    (1, 1, 3, 50.00, 1.34000, 67.00, '2026-10-02 12:00:00', NULL),
    (2, 3, 4, 100.00, 150.00000, 15000.00, '2026-10-02 14:00:00', 'Test conversion');