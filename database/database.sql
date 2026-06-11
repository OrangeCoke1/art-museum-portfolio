-- Gallery Walk — 数据库 schema
--
-- 推荐使用 Supabase（PostgreSQL）：
--   在 Supabase SQL Editor 中运行 database/supabase.sql
--
-- 以下为旧版 MySQL 脚本，仅在你本地仍使用 MySQL 时需要。

CREATE DATABASE IF NOT EXISTS art_gallery
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE art_gallery;

CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  status ENUM('active', 'unsubscribed') NOT NULL DEFAULT 'active',
  source VARCHAR(100) NOT NULL DEFAULT 'website',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_subscriptions_email (email),
  KEY idx_subscriptions_status (status),
  KEY idx_subscriptions_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO subscriptions (email, source)
VALUES ('test@example.com', 'website')
ON DUPLICATE KEY UPDATE email = email;
