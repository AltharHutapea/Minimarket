CREATE DATABASE minimarket;
USE minimarket;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'cashier') DEFAULT 'cashier',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, role, is_active) VALUES 
('Admin Utama', 'admin@minimarket.com', 'admin123', 'admin', 1);

SELECT * FROM users;