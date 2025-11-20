-- sql/schema.sql
-- IslandRoots Market – MySQL schema
-- Assumes MySQL 8+ with InnoDB + utf8mb4

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if you re-run
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS vendors;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================
--  users
-- =========================
CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
--  vendors (local makers / student creators)
-- =========================
CREATE TABLE vendors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  location_district VARCHAR(80) DEFAULT NULL,
  story TEXT DEFAULT NULL,
  avatar_url VARCHAR(512) DEFAULT NULL,
  contact_phone VARCHAR(40) DEFAULT NULL,
  contact_email VARCHAR(191) DEFAULT NULL,
  instagram VARCHAR(191) DEFAULT NULL,
  tiktok VARCHAR(191) DEFAULT NULL,
  -- Comma-separated TagKey values. Example: 'WOMEN_LED,LOCAL_FARMER'
  tags VARCHAR(255) DEFAULT NULL,
  owner_user_id BIGINT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_vendors_slug (slug),
  KEY idx_vendors_owner (owner_user_id),
  CONSTRAINT fk_vendors_owner
    FOREIGN KEY (owner_user_id) REFERENCES users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
--  products
-- =========================
CREATE TABLE products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  vendor_id BIGINT UNSIGNED DEFAULT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  description TEXT DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency CHAR(3) NOT NULL DEFAULT 'LKR',
  stock INT NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  -- Comma-separated TagKey values: 'WOMEN_LED,ZERO_WASTE,STUDENT_CREATOR,...'
  tags VARCHAR(255) DEFAULT NULL,
  -- Main image URL for card display
  main_image_url VARCHAR(512) DEFAULT NULL,
  -- Optional JSON array of additional image URLs
  gallery_json JSON DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_vendor (vendor_id),
  KEY idx_products_price (price),
  KEY idx_products_is_featured (is_featured),
  CONSTRAINT fk_products_vendor
    FOREIGN KEY (vendor_id) REFERENCES vendors (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
--  orders (soft-checkout requests)
-- =========================
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED DEFAULT NULL, -- nullable to allow guest orders later if you want
  customer_name VARCHAR(160) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  customer_email VARCHAR(191) DEFAULT NULL,
  delivery_address TEXT NOT NULL,
  delivery_district VARCHAR(80) DEFAULT NULL,
  payment_preference ENUM('COD', 'BANK_TRANSFER', 'PICKUP') NOT NULL DEFAULT 'COD',
  notes TEXT DEFAULT NULL,
  status ENUM('PENDING', 'CONTACTED', 'COMPLETED', 'CANCELLED')
    NOT NULL DEFAULT 'PENDING',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency CHAR(3) NOT NULL DEFAULT 'LKR',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_user (user_id),
  KEY idx_orders_status (status),
  KEY idx_orders_created (created_at),
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
--  order_items
--  snapshot of product details at the time of order
-- =========================
CREATE TABLE order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  product_name_snapshot VARCHAR(200) NOT NULL,
  product_slug_snapshot VARCHAR(191) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency_snapshot CHAR(3) NOT NULL DEFAULT 'LKR',
  -- snapshot of product tags at time of order (same format as products.tags)
  tags_snapshot VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  KEY idx_order_items_product (product_id),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: seed admin user, demo vendor/product can go in a separate seed file

