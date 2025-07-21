-- Thêm cột nếu chưa có
IF COL_LENGTH('Users', 'reset_token') IS NULL
    ALTER TABLE Users ADD reset_token VARCHAR(255);

IF COL_LENGTH('Users', 'token_expiry') IS NULL
    ALTER TABLE Users ADD token_expiry DATETIME;

-- Sửa kiểu cột ImageURL
ALTER TABLE Products ALTER COLUMN ImageURL NVARCHAR(MAX);

-- Thêm DiscountPercent nếu chưa có
IF COL_LENGTH('Products', 'DiscountPercent') IS NULL
    ALTER TABLE Products ADD DiscountPercent FLOAT NULL;

-- Tạo bảng Wishlist nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Wishlist]') AND type in (N'U'))
BEGIN
    CREATE TABLE Wishlist (
        WishlistID INT PRIMARY KEY IDENTITY(1,1),
        UserID INT NOT NULL,
        ProductID INT NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_Wishlist_User FOREIGN KEY (UserID) REFERENCES Users(UserID),
        CONSTRAINT FK_Wishlist_Product FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
        CONSTRAINT UQ_Wishlist_User_Product UNIQUE (UserID, ProductID)
    );
END

-- An toàn khi xóa cột IsPrimary
DECLARE @ConstraintName NVARCHAR(200);
SELECT @ConstraintName = dc.name
FROM sys.default_constraints dc
JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'ProductImages' AND c.name = 'IsPrimary';

IF @ConstraintName IS NOT NULL
    EXEC('ALTER TABLE ProductImages DROP CONSTRAINT ' + @ConstraintName);

IF EXISTS (SELECT * FROM sys.columns WHERE Name = N'IsPrimary' AND Object_ID = Object_ID(N'ProductImages'))
BEGIN
    ALTER TABLE ProductImages DROP COLUMN IsPrimary;
END

-- Sửa cột ImageURL
ALTER TABLE ProductImages ALTER COLUMN ImageURL NVARCHAR(MAX);

-- Bảng Users: thêm cột theo dõi
ALTER TABLE Users
    ADD last_login DATETIME NULL;  

	-- Bảng Notifications:
CREATE TABLE Notifications (
    id            INT IDENTITY PRIMARY KEY,
    user_id       INT NOT NULL,
    title         NVARCHAR(100),
    content       NVARCHAR(MAX),
    is_read       BIT DEFAULT 0,
    created_at    DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(UserID)
);
