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
	

	-- Bảng Taxes: Quản lý các mức thuế
CREATE TABLE Taxes (
    TaxID INT PRIMARY KEY IDENTITY(1,1),
    TaxName NVARCHAR(100) NOT NULL,
    TaxRate DECIMAL(5, 2) NOT NULL,
    Description NVARCHAR(MAX),
    EffectiveDate DATE NOT NULL,
    Status INT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    INDEX idx_tax_name NONCLUSTERED (TaxName)
);
GO

-- Dữ liệu mẫu cho bảng Taxes
INSERT INTO Taxes (TaxName, TaxRate, Description, EffectiveDate, Status) VALUES
(N'VAT', 10.00, N'Value Added Tax', '2025-01-01', 1),
(N'Sales Tax', 8.00, N'Sales Tax for Retail', '2025-01-01', 1);
GO

-- Add Blogs table
CREATE TABLE Blogs (
    BlogID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    UserID INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    Status INT NOT NULL DEFAULT 1, -- 1: Active, 0: Inactive
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    INDEX idx_blog_title NONCLUSTERED (Title)
);

-- Insert sample blog data
INSERT INTO Blogs (Title, Content, UserID, Status)
VALUES
(N'Healthy Eating Tips', N'Explore the benefits of organic foods and tips for a balanced diet.', 1, 1),
(N'Farm-to-Table Benefits', N'Learn how farm-to-table practices enhance food quality.', 1, 1);


CREATE TABLE TraderProducts (
    traderProductId INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL, -- Foreign key đến bảng Users
    productName NVARCHAR(255) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    initialStockQuantity INT NOT NULL,
    currentStockQuantity INT NOT NULL,
    warehouseLocation NVARCHAR(255),
    status INT DEFAULT 1, -- 1: active, 0: inactive
    createdAt DATETIME DEFAULT GETDATE(),
    lastUpdated DATETIME DEFAULT GETDATE(),
    imageURL NVARCHAR(MAX),

    FOREIGN KEY (userId) REFERENCES Users(userId)
);
CREATE TABLE TraderProductMapping (
    id INT IDENTITY(1,1) PRIMARY KEY,
    traderProductId INT NOT NULL,
    productId INT NOT NULL,
    userId INT NOT NULL,

    FOREIGN KEY (traderProductId) REFERENCES TraderProducts(traderProductId) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(productId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(userId)
);
