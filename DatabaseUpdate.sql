ALTER TABLE users
ADD reset_token VARCHAR(255),
    token_expiry DATETIME;
