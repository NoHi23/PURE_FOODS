ALTER TABLE users
ADD reset_token VARCHAR(255),
    token_expiry DATETIME;

ALTER TABLE Products
ALTER COLUMN ImageURL Nvarchar(max);

--update product
ALTER TABLE Products 
ADD DiscountPercent FLOAT NULL;

CREATE TABLE Wishlist (
    WishlistID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Wishlist_User FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Wishlist_Product FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    CONSTRAINT UQ_Wishlist_User_Product UNIQUE (UserID, ProductID)
);


--new 29.4.2025
ALTER TABLE dbo.ProductImages
DROP CONSTRAINT DF__ProductIm__IsPri__534D60F1;
GO
ALTER TABLE ProductImages
DROP COLUMN IsPrimary;

ALTER TABLE ProductImages
ALTER COLUMN ImageURL Nvarchar(max);

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


--update 17/7/2025

ALTER TABLE [Orders]
ADD 
    PaymentMethod NVARCHAR(50),         -- 'COD', 'VNPAY', 'Stripe', 'PayPal'
    PaymentStatus NVARCHAR(50);     