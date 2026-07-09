-- ============================================
-- LocalFix Database Schema (SQL Server)
-- ============================================

IF DB_ID('LocalFixDB') IS NULL
BEGIN
    CREATE DATABASE LocalFixDB;
END
GO

USE LocalFixDB;
GO

-- ============================================
-- 1. Users (Customer, Worker, Admin)
-- ============================================
IF OBJECT_ID('dbo.Users', 'U') IS NULL
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    phone NVARCHAR(20) NULL,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL CHECK (role IN ('customer','worker','admin')),
    is_blocked BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- ============================================
-- 2. Service Categories
-- ============================================
IF OBJECT_ID('dbo.ServiceCategories', 'U') IS NULL
CREATE TABLE ServiceCategories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(500) NULL,
    icon NVARCHAR(100) NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- ============================================
-- 3. Worker Profiles
-- ============================================
IF OBJECT_ID('dbo.WorkerProfiles', 'U') IS NULL
CREATE TABLE WorkerProfiles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    category_id INT NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    bio NVARCHAR(1000) NULL,
    pincode NVARCHAR(10) NOT NULL,
    city NVARCHAR(100) NULL,
    state NVARCHAR(100) NULL,
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    availability BIT NOT NULL DEFAULT 1,
    id_proof_url NVARCHAR(500) NULL,
    profile_image_url NVARCHAR(500) NULL,
    verification_status NVARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (verification_status IN ('pending','approved','rejected')),
    rating_avg DECIMAL(3,2) NOT NULL DEFAULT 0,
    total_reviews INT NOT NULL DEFAULT 0,
    jobs_completed INT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_WorkerProfiles_User FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT FK_WorkerProfiles_Category FOREIGN KEY (category_id) REFERENCES ServiceCategories(id)
);
GO

-- ============================================
-- 4. Service Requests
-- ============================================
IF OBJECT_ID('dbo.ServiceRequests', 'U') IS NULL
CREATE TABLE ServiceRequests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    worker_id INT NOT NULL,
    category_id INT NOT NULL,
    description NVARCHAR(1000) NOT NULL,
    address NVARCHAR(500) NOT NULL,
    pincode NVARCHAR(10) NOT NULL,
    scheduled_date DATETIME2 NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','accepted','in_progress','completed','cancelled','rejected')),
    price DECIMAL(10,2) NULL,
    payment_status NVARCHAR(20) NOT NULL DEFAULT 'unpaid'
        CHECK (payment_status IN ('unpaid','paid_offline')),
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    completed_at DATETIME2 NULL,
    CONSTRAINT FK_Requests_Customer FOREIGN KEY (customer_id) REFERENCES Users(id),
    CONSTRAINT FK_Requests_Worker FOREIGN KEY (worker_id) REFERENCES Users(id),
    CONSTRAINT FK_Requests_Category FOREIGN KEY (category_id) REFERENCES ServiceCategories(id)
);
GO

-- ============================================
-- 5. Reviews
-- ============================================
IF OBJECT_ID('dbo.Reviews', 'U') IS NULL
CREATE TABLE Reviews (
    id INT IDENTITY(1,1) PRIMARY KEY,
    request_id INT NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    worker_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(1000) NULL,
    is_flagged BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Reviews_Request FOREIGN KEY (request_id) REFERENCES ServiceRequests(id) ON DELETE CASCADE,
    CONSTRAINT FK_Reviews_Customer FOREIGN KEY (customer_id) REFERENCES Users(id),
    CONSTRAINT FK_Reviews_Worker FOREIGN KEY (worker_id) REFERENCES Users(id)
);
GO

-- ============================================
-- 6. Fraud Alerts (used in Step 4)
-- ============================================
IF OBJECT_ID('dbo.FraudAlerts', 'U') IS NULL
CREATE TABLE FraudAlerts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    worker_id INT NOT NULL,
    reason NVARCHAR(500) NOT NULL,
    severity NVARCHAR(20) NOT NULL DEFAULT 'low'
        CHECK (severity IN ('low','medium','high')),
    resolved BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Fraud_Worker FOREIGN KEY (worker_id) REFERENCES Users(id) ON DELETE CASCADE
);
GO

-- ============================================
-- Seed: Default service categories
-- ============================================
IF NOT EXISTS (SELECT 1 FROM ServiceCategories)
BEGIN
    INSERT INTO ServiceCategories (name, description, icon) VALUES
    ('Electrician', 'Wiring, repairs, installations', 'zap'),
    ('Plumber', 'Pipes, taps, drainage, water tanks', 'droplet'),
    ('Painter', 'Interior and exterior painting', 'paintbrush'),
    ('Carpenter', 'Furniture, doors, wood work', 'hammer'),
    ('AC Repair', 'AC servicing and repair', 'wind'),
    ('Home Cleaning', 'Deep cleaning and housekeeping', 'sparkles'),
    ('Mechanic', 'Vehicle repair and servicing', 'wrench'),
    ('Mason', 'Construction, tiling, brickwork', 'brick-wall');
END
GO

PRINT '✅ LocalFix schema initialized successfully';