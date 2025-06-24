ALTER TABLE users
ADD reset_token VARCHAR(255),
    token_expiry DATETIME;

ALTER TABLE Products
ALTER COLUMN ImageURL Nvarchar(max);
