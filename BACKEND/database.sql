USE CleanFoodShop;
GO
-- Bảng Role: Quản lý vai trò người dùng
CREATE TABLE Role (
RoleID INT PRIMARY KEY IDENTITY(1,1),
RoleName NVARCHAR(255) NOT NULL,
);
GO
-- Bảng Users: Quản lý người dùng
CREATE TABLE Users (
UserID INT PRIMARY KEY IDENTITY(1,1),
FullName NVARCHAR(100) NOT NULL,
Email NVARCHAR(100) NOT NULL UNIQUE,
Password NVARCHAR(255) NOT NULL,
RoleID INT,
Phone NVARCHAR(20),
Address NVARCHAR(255),
Status INT NULL, -- Đã có, cho phép NULL
CreatedAt DATETIME DEFAULT GETDATE(),
FOREIGN KEY (RoleID) REFERENCES Role(RoleID),
INDEX idx_email NONCLUSTERED (Email)
);
GO
-- Bảng Categories: Quản lý danh mục sản phẩm
CREATE TABLE Categories (
CategoryID INT PRIMARY KEY IDENTITY(1,1),
CategoryName NVARCHAR(100) NOT NULL,
Description NVARCHAR(MAX),
IsOrganic BIT DEFAULT 0,
Status INT NULL,
INDEX idx_category_name NONCLUSTERED (CategoryName)
);
GO
-- Bảng Suppliers: Quản lý nhà cung cấp
CREATE TABLE Suppliers (
SupplierID INT PRIMARY KEY IDENTITY(1,1),
SupplierName NVARCHAR(100) NOT NULL,
ContactName NVARCHAR(100),
Phone NVARCHAR(20),
Email NVARCHAR(100),
Address NVARCHAR(255),
OrganicCertification NVARCHAR(100),
CertificationExpiry DATE,
CreatedAt DATETIME DEFAULT GETDATE(),
Status INT NULL,
INDEX idx_supplier_name NONCLUSTERED (SupplierName)
);
GO
-- Bảng Products: Thông tin cơ bản của sản phẩm
CREATE TABLE Products (
ProductID INT PRIMARY KEY IDENTITY(1,1),
ProductName NVARCHAR(100) NOT NULL,
CategoryID INT,
SupplierID INT,
Price DECIMAL(10, 2) NOT NULL,
StockQuantity INT NOT NULL CHECK (StockQuantity >= 0),
Description NVARCHAR(MAX),
ImageURL NVARCHAR(255),
LastUpdatedBy INT,
CreatedAt DATETIME DEFAULT GETDATE(),
Status INT NULL,
FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID),
FOREIGN KEY (LastUpdatedBy) REFERENCES Users(UserID),
INDEX idx_product_name NONCLUSTERED (ProductName),
INDEX idx_category_id NONCLUSTERED (CategoryID)
);
GO
-- Bảng ProductDetails: Thông tin chi tiết của sản phẩm
CREATE TABLE ProductDetails (
ProductID INT PRIMARY KEY,
HarvestDate DATE,
ExpirationDate DATE,
NutritionalInfo NVARCHAR(MAX),
Status INT NULL,
FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO
CREATE TABLE OrganicStatus(
OrganicStatusID  INT PRIMARY KEY IDENTITY(1,1),
OrganicStatusName  NVARCHAR(255) NOT NULL
)
-- Bảng ProductOrganicInfo: Thông tin trạng thái hữu cơ
CREATE TABLE ProductOrganicInfo (
ProductID INT PRIMARY KEY,
OrganicStatusID INT,
Status INT NULL,
FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
FOREIGN KEY (OrganicStatusID) REFERENCES OrganicStatus(OrganicStatusID)
);
GO
-- Bảng ProductImages: Lưu hình ảnh sản phẩm
CREATE TABLE ProductImages (
ImageID INT PRIMARY KEY IDENTITY(1,1),
ProductID INT,
ImageURL NVARCHAR(255) NOT NULL,
IsPrimary BIT DEFAULT 0,
CreatedAt DATETIME DEFAULT GETDATE(),
Status INT NULL,
FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO
-- Bảng ShippingMethods: Quản lý phương thức vận chuyển
CREATE TABLE ShippingMethods (
ShippingMethodID INT PRIMARY KEY IDENTITY(1,1),
MethodName NVARCHAR(100) NOT NULL,
Description NVARCHAR(MAX),
Cost DECIMAL(10, 2) NOT NULL,
IsColdChain BIT DEFAULT 0,
EstimatedDeliveryTime NVARCHAR(50),
Status INT NULL,
INDEX idx_method_name NONCLUSTERED (MethodName)
);
GO
-- Bảng ShippingFees: Quản lý phí vận chuyển theo khoảng cách/vùng
CREATE TABLE ShippingFees (
ShippingFeeID INT PRIMARY KEY IDENTITY(1,1),
ShippingMethodID INT,
MinDistance DECIMAL(10,2) NOT NULL,
MaxDistance DECIMAL(10,2) NOT NULL,
Fee DECIMAL(10, 2) NOT NULL,
Region NVARCHAR(100),
Status INT NULL,
FOREIGN KEY (ShippingMethodID) REFERENCES ShippingMethods(ShippingMethodID),
INDEX idx_shipping_method_id NONCLUSTERED (ShippingMethodID)
);
GO
-- Bảng Promotions: Quản lý giảm giá
CREATE TABLE Promotions (
PromotionID INT PRIMARY KEY IDENTITY(1,1),
PromotionCode NVARCHAR(50) NOT NULL UNIQUE,
Description NVARCHAR(MAX),
DiscountType NVARCHAR(50) NOT NULL CHECK (DiscountType IN ('Percentage', 'Fixed')),
DiscountValue DECIMAL(10, 2) NOT NULL,
StartDate DATETIME NOT NULL,
EndDate DATETIME NOT NULL,
MinOrderAmount DECIMAL(10, 2),
CreatedAt DATETIME DEFAULT GETDATE(),
Status INT NULL,
INDEX idx_promotion_code NONCLUSTERED (PromotionCode)
);
GO
-- Bảng OrderStatuses: Quản lý trạng thái đơn hàng
CREATE TABLE OrderStatuses (
StatusID INT PRIMARY KEY IDENTITY(1,1),
StatusName NVARCHAR(50) NOT NULL UNIQUE,
Description NVARCHAR(MAX),
Status INT NULL
);
GO
CREATE TABLE Drivers (
DriverID INT PRIMARY KEY IDENTITY(1,1),
DriverName NVARCHAR(100) NOT NULL,
Phone NVARCHAR(20),
Email NVARCHAR(100),
VehicleInfo NVARCHAR(255), -- Thông tin phương tiện
CreatedAt DATETIME DEFAULT GETDATE(),
Status INT NULL,
INDEX idx_driver_name NONCLUSTERED (DriverName)
);
GO
-- Bảng Orders: Quản lý đơn hàng
CREATE TABLE Orders (
OrderID INT PRIMARY KEY IDENTITY(1,1),
CustomerID INT,
OrderDate DATETIME DEFAULT GETDATE(),
TotalAmount DECIMAL(10, 2) NOT NULL,
StatusID INT,
ShippingAddress NVARCHAR(255) NOT NULL,
ShippingMethodID INT,
ShippingCost DECIMAL(10, 2),
Distance DECIMAL(10,2),
DiscountAmount DECIMAL(10, 2) DEFAULT 0,
Status INT NULL,
CancelReason NVARCHAR(255),
EstimatedDeliveryDate DATETIME,
DelayReason NVARCHAR(255),
DriverID INT,
FOREIGN KEY (DriverID) REFERENCES Drivers(DriverID),
FOREIGN KEY (CustomerID) REFERENCES Users(UserID),
FOREIGN KEY (StatusID) REFERENCES OrderStatuses(StatusID),
FOREIGN KEY (ShippingMethodID) REFERENCES ShippingMethods(ShippingMethodID),
INDEX idx_customer_id NONCLUSTERED (CustomerID),
INDEX idx_order_date NONCLUSTERED (OrderDate),
INDEX idx_status_id NONCLUSTERED (StatusID)
);
GO
-- Bảng OrderPromotions: Áp dụng giảm giá cho đơn hàng
CREATE TABLE OrderPromotions (
OrderID INT,
PromotionID INT,
DiscountApplied DECIMAL(10, 2) NOT NULL,
Status INT NULL,
PRIMARY KEY (OrderID, PromotionID),
FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
FOREIGN KEY (PromotionID) REFERENCES Promotions(PromotionID)
);
GO
-- Bảng OrderDetails: Chi tiết đơn hàng
CREATE TABLE OrderDetails (
OrderDetailID INT PRIMARY KEY IDENTITY(1,1),
OrderID INT,
ProductID INT,
Quantity INT NOT NULL CHECK (Quantity > 0),
UnitPrice DECIMAL(10, 2) NOT NULL,
Status INT NULL,
FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
INDEX idx_order_id NONCLUSTERED (OrderID)
);
GO
-- Bảng Payments: Quản lý thanh toán
CREATE TABLE Payments (
PaymentID INT PRIMARY KEY IDENTITY(1,1),
OrderID INT,
CustomerID INT,
PaymentMethod NVARCHAR(50) NOT NULL CHECK (PaymentMethod IN ('Cash', 'CreditCard', 'BankTransfer', 'MobileApp')),
Amount DECIMAL(10, 2) NOT NULL,
PaymentStatus NVARCHAR(50) NOT NULL CHECK (PaymentStatus IN ('Pending', 'Completed', 'Failed')),
PaymentDate DATETIME DEFAULT GETDATE(),
TransactionID NVARCHAR(100),
Status INT NULL,
FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
FOREIGN KEY (CustomerID) REFERENCES Users(UserID),
INDEX idx_order_id NONCLUSTERED (OrderID)
);
GO
-- Bảng Reviews: Đánh giá sản phẩm
CREATE TABLE Reviews (
ReviewID INT PRIMARY KEY IDENTITY(1,1),
ProductID INT,
CustomerID INT,
Rating INT CHECK (Rating >= 1 AND Rating <= 5),
Comment NVARCHAR(MAX),
CreatedAt DATETIME DEFAULT GETDATE(),
Status INT NULL,
FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
FOREIGN KEY (CustomerID) REFERENCES Users(UserID),
INDEX idx_product_id NONCLUSTERED (ProductID)
);
GO
-- Bảng CartItems: Giỏ hàng
CREATE TABLE CartItems (
CartItemID INT PRIMARY KEY IDENTITY(1,1),
UserID INT,
ProductID INT,
Quantity INT NOT NULL CHECK (Quantity > 0),
AddedAt DATETIME DEFAULT GETDATE(),
Status INT NULL,
FOREIGN KEY (UserID) REFERENCES Users(UserID),
FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
INDEX idx_user_id NONCLUSTERED (UserID)
);
GO
-- Bảng InventoryLogs: Lịch sử nhập/xuất kho
CREATE TABLE InventoryLogs (
LogID INT PRIMARY KEY IDENTITY(1,1),
ProductID INT,
UserID INT,
QuantityChange INT NOT NULL,
Reason NVARCHAR(255),
CreatedAt DATETIME DEFAULT GETDATE(),
Status INT NULL,
FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
FOREIGN KEY (UserID) REFERENCES Users(UserID),
INDEX idx_product_id NONCLUSTERED (ProductID)
);
GO
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT,
    UserID INT,
    Message NVARCHAR(255) NOT NULL,
    SentAt DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50) CHECK (Status IN ('Sent', 'Failed')),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    INDEX idx_order_id NONCLUSTERED (OrderID)
);

GO
-- Chèn dữ liệu mẫu vào bảng OrderStatuses
INSERT INTO OrderStatuses (StatusName, Description, Status)
VALUES
('Pending', N'Đơn hàng đang chờ xử lý', 1),
('Processing', N'Đơn hàng đang được xử lý', 1),
('Shipped', N'Đơn hàng đã được giao cho đơn vị vận chuyển', 1),
('Delivered', N'Đơn hàng đã được giao đến khách hàng', 1),
('Cancelled', N'Đơn hàng đã bị hủy', 0);
GO
GO
SET IDENTITY_INSERT Role On;
GO
-- Chèn dữ liệu mẫu vào bảng OrderStatuses
INSERT INTO Role(RoleID, RoleName)
VALUES
(1, N'Admin'),
(2, N'Customer'),
(3, N'Seller'),
(4, N'Exporter'),
(5,N'Importer'),
(6,N'Shipper');
GO
INSERT INTO Users (FullName, Email, Password, RoleID, Phone, Address, Status) VALUES
(N'Nguyen Van A', 'a.nguyen@email.com', 'pass123', 1, '0901234567', N'123 Le Loi, HN', 1),
(N'Tran Thi B', 'b.tran@email.com', 'pass456', 2, '0907654321', N'456 Hai Ba Trung, HCM', 1);
GO
INSERT INTO Categories (CategoryName, Description, IsOrganic, Status) VALUES
(N'Vegetables', N'Fresh organic vegetables', 1, 1),
(N'Fruits', N'Fresh seasonal fruits', 0, 1);
GO
INSERT INTO Suppliers (SupplierName, ContactName, Phone, Email, Address, OrganicCertification, CertificationExpiry, Status) VALUES
(N'Organic Farm A', N'Le Van C', '0912345678', 'contact@organicfarm.com', N'789 Nguyen Trai, DN', N'Cert-001', '2026-06-01', 1),
(N'Fresh Produce B', N'Pham Thi D', '0918765432', 'info@freshproduce.com', N'101 Tran Phu, HN', NULL, NULL, 1);
GO
INSERT INTO Products (ProductName, CategoryID, SupplierID, Price, StockQuantity, Description, ImageURL, LastUpdatedBy, Status) VALUES
(N'Organic Spinach', 1, 1, 50.00, 100, N'Fresh organic spinach', 'spinach.jpg', 1, 1),
(N'Apple', 2, 2, 30.00, 150, N'Fresh red apples', 'apple.jpg', 1, 1);
GO
INSERT INTO ProductDetails (ProductID, HarvestDate, ExpirationDate, NutritionalInfo, Status) VALUES
(1, '2025-05-20', '2025-06-20', N'Rich in vitamins A and C', 1),
(2, '2025-05-15', '2025-06-15', N'High in fiber', 1);
GO
INSERT INTO OrganicStatus (OrganicStatusName) VALUES
(N'Certified Organic'),
(N'Non-Organic');
GO
INSERT INTO ProductOrganicInfo (ProductID, OrganicStatusID, Status) VALUES
(1, 1, 1),
(2, 2, 1);
GO
INSERT INTO ProductImages (ProductID, ImageURL, IsPrimary, Status) VALUES
(1, 'spinach1.jpg', 1, 1),
(2, 'apple1.jpg', 1, 1);
GO
INSERT INTO ShippingMethods (MethodName, Description, Cost, IsColdChain, EstimatedDeliveryTime, Status) VALUES
(N'Standard Shipping', N'Standard delivery', 10.00, 0, N'3-5 days', 1),
(N'Express Shipping', N'Fast delivery', 20.00, 1, N'1-2 days', 1);
GO
INSERT INTO ShippingFees (ShippingMethodID, MinDistance, MaxDistance, Fee, Region, Status) VALUES
(1, 0.00, 10.00, 5.00, N'Hanoi', 1),
(2, 0.00, 5.00, 15.00, N'Ho Chi Minh', 1);
GO
INSERT INTO Promotions (PromotionCode, Description, DiscountType, DiscountValue, StartDate, EndDate, MinOrderAmount, Status) VALUES
(N'SAVE10', N'10% off on first order', 'Percentage', 10.00, '2025-06-01', '2025-06-30', 50.00, 1),
(N'FIXED5', N'5$ off on orders', 'Fixed', 5.00, '2025-06-01', '2025-06-30', 20.00, 1);
GO
INSERT INTO Drivers (DriverName, Phone, Email, VehicleInfo, Status) VALUES
(N'Nguyen Van E', '0923456789', 'e.nguyen@driver.com', N'Truck ABC-123', 1),
(N'Tran Van F', '0929876543', 'f.tran@driver.com', N'Van XYZ-456', 1);
GO
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount, StatusID, ShippingAddress, ShippingMethodID, ShippingCost, Distance, DiscountAmount, Status, EstimatedDeliveryDate, DriverID) VALUES
(2, '2025-06-07 08:00:00', 80.00, 1, N'123 Le Loi, HN', 1, 10.00, 5.00, 5.00, 1, '2025-06-10', 1),
(2, '2025-06-07 08:05:00', 60.00, 2, N'456 Hai Ba Trung, HCM', 2, 20.00, 3.00, 0.00, 1, '2025-06-09', 2);
GO
INSERT INTO OrderPromotions (OrderID, PromotionID, DiscountApplied, Status) VALUES
(1, 1, 8.00, 1),
(2, 2, 5.00, 1);
GO
INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice, Status) VALUES
(1, 1, 2, 50.00, 1),
(2, 2, 2, 30.00, 1);
GO
INSERT INTO Payments (OrderID, CustomerID, PaymentMethod, Amount, PaymentStatus, PaymentDate, TransactionID, Status) VALUES
(1, 2, 'CreditCard', 75.00, 'Completed', '2025-06-07 08:10:00', 'TXN-001', 1),
(2, 2, 'Cash', 60.00, 'Pending', '2025-06-07 08:15:00', 'TXN-002', 1);
GO
INSERT INTO Reviews (ProductID, CustomerID, Rating, Comment, Status) VALUES
(1, 2, 4, N'Good quality!', 1),
(2, 2, 5, N'Excellent taste!', 1);
GO
INSERT INTO CartItems (UserID, ProductID, Quantity, Status) VALUES
(2, 1, 1, 1),
(2, 2, 1, 1);
GO
INSERT INTO InventoryLogs (ProductID, UserID, QuantityChange, Reason, Status) VALUES
(1, 1, 50, N'Stock replenishment', 1),
(2, 1, 100, N'New shipment', 1);
GO