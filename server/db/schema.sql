-- Virava Chemicals — database schema
-- Safe to re-run: drops and recreates all tables.

DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS principals CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

CREATE TABLE admins (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE categories (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  principal_id INT DEFAULT NULL,
  solution    TEXT DEFAULT NULL,   -- Godrej product solution this category sits under
  tagline     TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image_url   TEXT DEFAULT '',
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  cas_no      TEXT DEFAULT '',
  grade       TEXT DEFAULT '',
  packaging   TEXT DEFAULT '',
  specs       JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_url   TEXT DEFAULT '',
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE principals (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  logo_url    TEXT DEFAULT '',
  website     TEXT DEFAULT '',
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE industries (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url   TEXT DEFAULT '',
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE hero_slides (
  id          SERIAL PRIMARY KEY,
  title       TEXT DEFAULT '',
  subtitle    TEXT DEFAULT '',
  image_url   TEXT NOT NULL,
  cta_text    TEXT DEFAULT '',
  cta_link    TEXT DEFAULT '',
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE blogs (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  excerpt      TEXT DEFAULT '',
  content      TEXT DEFAULT '',
  category     TEXT DEFAULT '',
  author       TEXT DEFAULT '',
  image_url    TEXT DEFAULT '',
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sort_order   INT NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE enquiries (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT DEFAULT '',
  company     TEXT DEFAULT '',
  subject     TEXT DEFAULT '',
  message     TEXT NOT NULL,
  product_id  INT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'new',  -- new | read | replied
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_created ON enquiries(created_at DESC);
