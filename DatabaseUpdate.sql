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


-- lolo
-- HUYND, run là được
-- bôi đen run, test categories filter
-- Update bảng categories 22/07/2025 01:05
INSERT INTO [CleanFoodShop].[dbo].[Categories] 
    ([CategoryName], [Description], [IsOrganic], [Status])
VALUES
    (N'Frozen Foods', N'Chế phẩm cấp đông như rau củ, thịt, đồ ăn nhanh sạch.', 0, 1),
    (N'Meats & Seafoods', N'Thịt và hải sản sạch, không chất tăng trưởng.', 0, 1),
    (N'Beverages & Milk', N'Đồ uống, sữa hữu cơ, không chất bảo quản.', 1, 1),
    (N'Pet Foods', N'Thức ăn sạch cho thú cưng, nguyên liệu tự nhiên.', 0, 1);

-- thêm sản phẩm cho Products
-- CategoryID = 3 (Frozen Foods)
INSERT INTO [CleanFoodShop].[dbo].[Products]
    ([ProductName], [CategoryID], [SupplierID], [Price], [StockQuantity], [Description], [ImageURL], [LastUpdatedBy], [CreatedAt], [Status], [DiscountPercent])
VALUES
(N'Frozen Mixed Vegetables', 3, 3, 120.00, 100, N'Rau củ hỗn hợp cấp đông, tiện lợi và giàu dinh dưỡng.', 'https://product.hstatic.net/200000352097/product/rau-hon-hop-sg-food-goi-500g-201907161538002913_ec6d500b5d164979977ac5d8de18d5ae.jpg', 1, GETDATE(), 1, NULL),
(N'Frozen Chicken Wings', 3, 4, 150.00, 120, N'Cánh gà cấp đông, đảm bảo chất lượng.', 'https://images-handler.kamereo.vn/eyJidWNrZXQiOiJpbWFnZS1oYW5kbGVyLXByb2QiLCJrZXkiOiJzdXBwbGllci82NTQvUFJPRFVDVF9JTUFHRS8zNmMzYzkyYS1hZTM1LTQ0NjEtODYzNC0wOTYxN2E1ZDA3YWEuanBnIn0=', 1, GETDATE(), 1, NULL),
(N'Frozen Shrimp', 3, 5, 210.00, 90, N'Tôm đông lạnh, tươi ngon như mới đánh bắt.', 'https://images-handler.kamereo.vn/eyJidWNrZXQiOiJpbWFnZS1oYW5kbGVyLXByb2QiLCJrZXkiOiJzdXBwbGllci82NTQvUFJPRFVDVF9JTUFHRS81ZWJmODc1YS05NmQ4LTRhMDctYWYxMi00ODA2YWIwYjc0YmMucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo1MDAsImhlaWdodCI6NTAwLCJmaXQiOiJmaWxsIn19fQ==', 1, GETDATE(), 1, NULL),
(N'Frozen Dumplings', 3, 6, 130.00, 150, N'Bánh bao nhân thịt đông lạnh, hấp dẫn và tiện dụng.', 'https://thucphamnhanh.com/wp-content/uploads/2020/10/banh-bao-thit-trung-cut.jpg', 1, GETDATE(), 1, NULL),
(N'Frozen Beef Slices', 3, 3, 180.00, 70, N'Thịt bò thái lát cấp đông, dùng cho lẩu hoặc xào.', 'https://file.hstatic.net/200000301004/file/thit-bo-dong-lanh-2_e6ca4ffd20ff401f8e2e911b38c70b00.jpg', 1, GETDATE(), 1, NULL),
(N'Frozen Pizza Margherita', 3, 4, 220.00, 60, N'Pizza đông lạnh vị truyền thống Ý.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqQ0JNpgArppcXyDRqfY01qWY18gQ5kSsooA&s', 1, GETDATE(), 1, NULL),
(N'Frozen Spinach', 3, 5, 110.00, 80, N'Rau chân vịt đông lạnh giữ nguyên dưỡng chất.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp-b6AlP5Nr80vIcqwd1KHGMEZ68I-lDSPeA&s', 1, GETDATE(), 1, NULL),
(N'Frozen French Fries', 3, 6, 140.00, 200, N'Khoai tây chiên cấp đông giòn tan.', 'https://csfood.vn/wp-content/uploads/2021/01/Khoai-T%C3%A2y-%C4%90%C3%B4ng-L%E1%BA%A1nh-S%E1%BB%A3i-L%E1%BB%9Bn-Potato-Chips-Lutosa-G%C3%B3i-1kg.png', 1, GETDATE(), 1, NULL),
(N'Frozen Salmon Fillet', 3, 3, 250.00, 50, N'Cá hồi đông lạnh cắt lát, giàu omega-3.', 'https://greengood.vn/wp-content/uploads/2024/01/59.jpg', 1, GETDATE(), 1, NULL),
(N'Frozen Tofu Cubes', 3, 4, 100.00, 160, N'Đậu hũ cấp đông, tiện chế biến món chay.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToHCQW9mCR-kytkQhuV3R0LxFQGwlL4eH3pw&s', 1, GETDATE(), 1, NULL);

-- CategoryID = 4 (Meats & Seafoods)
INSERT INTO [CleanFoodShop].[dbo].[Products]
    ([ProductName], [CategoryID], [SupplierID], [Price], [StockQuantity], [Description], [ImageURL], [LastUpdatedBy], [CreatedAt], [Status], [DiscountPercent])
VALUES
(N'Organic Chicken Breast', 4, 5, 180.00, 90, N'Ức gà hữu cơ, không chất tăng trưởng.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMJ7vAfC73du4pBsRIClNPW5YpkPEOEAIqIg&s', 1, GETDATE(), 1, NULL),
(N'Beef Ribeye Steak', 4, 6, 320.00, 70, N'Sườn bò cao cấp nhập khẩu.', 'https://amp.thucphamsachhd.com/uploads/files/2023/06/13/s-n-Nga-prime.jpg', 1, GETDATE(), 1, NULL),
(N'Pork Tenderloin', 4, 3, 200.00, 100, N'Thịt heo nạc sạch, mềm ngon.', 'https://bizweb.dktcdn.net/100/406/569/products/nac-mong-heo-nhap-khau-jpeg.jpg?v=1621930945023', 1, GETDATE(), 1, NULL),
(N'Duck Leg Confit', 4, 4, 240.00, 60, N'Chân vịt chế biến kiểu Pháp.', 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/cach_lam_chan_vit_cay_tu_xuyen_0_1_1_df2c36688e.jpg', 1, GETDATE(), 1, NULL),
(N'Salmon Fillet', 4, 5, 270.00, 80, N'Cá hồi Na Uy tươi ngon.', 'https://file.hstatic.net/200000775599/file/cach-chon-ca-hoi-ngon_f6db7e90f91648d0bf9a5457944aba8c_grande.png', 1, GETDATE(), 1, NULL),
(N'Mackerel Fillet', 4, 6, 160.00, 120, N'Cá thu phi lê, giàu dinh dưỡng.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNxbBYjmxUr6AgzNIJS1pYJUth9IPpZswdBg&s', 1, GETDATE(), 1, NULL),
(N'Organic Lamb Chops', 4, 3, 400.00, 50, N'Sườn cừu hữu cơ, ít béo.', 'https://khaihoanphuquoc.com.vn/wp-content/uploads/2024/01/suon-heo-chien-nuoc-mam-3-e1704261943819.jpg', 1, GETDATE(), 1, NULL),
(N'Squid Cleaned', 4, 4, 190.00, 110, N'Mực làm sạch, dễ chế biến.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi12sBS1N_9BdOV2RzNH1wDVHLPYulE_yu0b5tOgPt__OXkSIGtT1zCTI8Xr4bYFSJK-Y&usqp=CAU', 1, GETDATE(), 1, NULL),
(N'Fresh Tuna Steak', 4, 5, 350.00, 60, N'Cá ngừ cắt lát, chất lượng sashimi.', 'https://haisanantoan.vn/wp-content/uploads/2020/03/t%E1%BA%A3i-xu%E1%BB%91ng-2.jpg', 1, GETDATE(), 1, NULL),
(N'Organic Minced Pork', 4, 6, 150.00, 140, N'Thịt heo xay hữu cơ.', 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8781/233782/bhx/cdntgddvnproductsimages8781241238bhxba-roi-heo-rut-suon-g-kitchen-khay-300g-202106021510397530_202410311040593558.jpg', 1, GETDATE(), 1, NULL);

-- CategoryID = 5 (Beverages & Milk)
INSERT INTO [CleanFoodShop].[dbo].[Products]
    ([ProductName], [CategoryID], [SupplierID], [Price], [StockQuantity], [Description], [ImageURL], [LastUpdatedBy], [CreatedAt], [Status], [DiscountPercent])
VALUES
(N'Organic Soy Milk', 5, 3, 110.00, 200, N'Sữa đậu nành hữu cơ nguyên chất.', 'https://file.hstatic.net/200000700229/article/1114510-15583224785381977809742-1_bf76d1d336f64efd8b2193a7678b41e9.jpg', 1, GETDATE(), 1, NULL),
(N'Fresh Cow Milk', 5, 4, 120.00, 180, N'Sữa bò tươi tiệt trùng, không chất bảo quản.', 'https://satrafoods.com.vn/uploads/Files/vnm-co-duong-500x500.jpg', 1, GETDATE(), 1, NULL),
(N'Coconut Water', 5, 5, 130.00, 170, N'Nước dừa nguyên chất từ miền nhiệt đới.', 'https://media.vov.vn/sites/default/files/styles/large/public/2023-07/nuoc_dua.jpg', 1, GETDATE(), 1, NULL),
(N'Kombucha Tea', 5, 6, 150.00, 160, N'Trà Kombucha lên men tốt cho hệ tiêu hoá.', 'https://vgreen.vn/uploaded/tin-tuc/tra-kombucha-dong-chai-2.jpg', 1, GETDATE(), 1, NULL),
(N'Organic Almond Milk', 5, 3, 180.00, 150, N'Sữa hạnh nhân hữu cơ, không lactose.', 'https://suachobeyeu.vn/upload/images/thung-sua-dau-nanh-hanh-nhan-vinamilk-hop-180ml-2.jpg', 1, GETDATE(), 1, NULL),
(N'Cold Brew Coffee', 5, 4, 140.00, 100, N'Cà phê ủ lạnh, vị đậm đà.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiYJL_g1s_bTF5UuBYKxM1Ex7hp1aMkQj0NQ&s', 1, GETDATE(), 1, NULL),
(N'Herbal Detox Tea', 5, 5, 100.00, 130, N'Trà thảo mộc detox cơ thể.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLzdMSmXcfIR2cFSCZiCdGjqDoXR8nYaXtvw&s', 1, GETDATE(), 1, NULL),
(N'Organic Orange Juice', 5, 6, 160.00, 90, N'Nước cam hữu cơ giàu vitamin C.', 'https://karofi.karofi.com/karofi-com/2022/06/uong-nuoc-cam-dung-cach.png', 1, GETDATE(), 1, NULL),
(N'Rice Milk Drink', 5, 3, 135.00, 140, N'Nước gạo rang thơm ngon dễ uống.', 'https://suachobeyeu.vn/application/upload/products/nuoc-gao-han-quoc-sahmyook-chai-1500ml-a3.jpg', 1, GETDATE(), 1, NULL),
(N'Natural Mineral Water', 5, 4, 90.00, 200, N'Nước khoáng tự nhiên, giàu khoáng chất.', 'https://binhminhcompany.vn/hoanghung/5/images/nuoc%20uong%20lavie%20giao%20tan%20nha(1).png', 1, GETDATE(), 1, NULL);

-- CategoryID = 6 (Pet Foods)
INSERT INTO [CleanFoodShop].[dbo].[Products]
    ([ProductName], [CategoryID], [SupplierID], [Price], [StockQuantity], [Description], [ImageURL], [LastUpdatedBy], [CreatedAt], [Status], [DiscountPercent])
VALUES
(N'Organic Dog Kibble', 6, 5, 200.00, 100, N'Thức ăn khô hữu cơ cho mèo trưởng thành.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8shmAiP6kaxp1s8EIAv61jdvxOtCAahCkZg&s', 1, GETDATE(), 1, NULL),
(N'Wet Cat Food - Tuna', 6, 6, 150.00, 120, N'Thức ăn ướt cho mèo vị cá ngừ.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHrudBRqKfs-_b9pjkFCeEky5nIe-8fD5IkQ&s', 1, GETDATE(), 1, NULL),
(N'Natural Bird Seeds', 6, 3, 100.00, 150, N'Hạt dinh dưỡng sạch cho chim cảnh.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1sj1zjbTXTvwoAhgzX7N3zGKZxQQags3XXg&s', 1, GETDATE(), 1, NULL),
(N'Dog Treats - Chicken Jerky', 6, 4, 180.00, 90, N'Bánh thưởng gà khô cho chó.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj8TUHxNbEqbII-DLCwT6BWi_I_n_eF7bXUQ&s', 1, GETDATE(), 1, NULL),
(N'Cat Treats - Salmon', 6, 5, 170.00, 80, N'Bánh thưởng vị cá hồi cho chó.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Pfg1VO7skHT_2o-tcUgznZezLksoianKNg&s', 1, GETDATE(), 1, NULL),
(N'Reptile Food Mix', 6, 6, 160.00, 60, N'Thức ăn hỗn hợp cho bò sát cảnh.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaJVRiJL82TD4bHjaAlOTRKLzUOiOLlonRUQ&s', 1, GETDATE(), 1, NULL),
(N'Organic Puppy Food', 6, 3, 220.00, 100, N'Thức ăn hữu cơ cho chó con.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2q6mPaETWDgOAHSdw9NmPDBQgiTC2CNTh4g&s', 1, GETDATE(), 1, NULL),
(N'Fish Food Flakes', 6, 4, 90.00, 140, N'Thức ăn dạng vảy cho cá cảnh.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTiYb9bk3ha1bDi9Gt-7leiOxcNgVHK59gDA&s', 1, GETDATE(), 1, NULL),
(N'Cat Milk Substitute', 6, 5, 130.00, 120, N'Sữa thay thế cho mèo con.', 'https://www.puprise.com/wp-content/uploads/2019/08/Himalaya-Healthy-Pet-Food-Meat-Rice-Dog-Food.jpg', 1, GETDATE(), 1, NULL),
(N'Pet Dental Chews', 6, 6, 140.00, 110, N'Xương gặm làm sạch răng thú cưng.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-JGf9yOlz4RVkvXrc641zEGlJIgq9LF7ihw&s', 1, GETDATE(), 1, NULL);

--hieunn update 23/7/2025

CREATE TABLE SpinHistory (
    id INT PRIMARY KEY IDENTITY,
    userId INT NOT NULL,
    spinDate DATE NOT NULL,
    promotionCode VARCHAR(50),
    CONSTRAINT UQ_User_SpinDate UNIQUE (userId, spinDate)
);

CREATE TABLE UserPromotion (
    id INT PRIMARY KEY IDENTITY,
    userId INT NOT NULL,
    promotionCode VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'used', 'expired'
    assignedDate DATE NOT NULL
);

INSERT INTO [CleanFoodShop].[dbo].[Users] 
	(FullName, Email, Password, RoleID, Phone, Address, Status, reset_token, token_expiry, last_login) 
VALUES ('Admin Test', 'admin1@gmail.com', 'admin', 1, 0123456789, 'FPT Campus Hoa Lac', 0, NULL, NULL, NULL);
