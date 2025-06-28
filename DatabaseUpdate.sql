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



