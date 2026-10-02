-- Neon Database Schema for TestBeat Aggregator

CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255),
  address TEXT,
  pincode VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_phone VARCHAR(15) NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  patient_age INT,
  patient_gender VARCHAR(10),
  patient_relation VARCHAR(50),
  item_name VARCHAR(255) NOT NULL,
  item_type VARCHAR(50),
  lab_name VARCHAR(255) NOT NULL,
  collection_date DATE,
  slot VARCHAR(100),
  address TEXT,
  pincode VARCHAR(10),
  total_amount NUMERIC(10, 2) NOT NULL,
  b2b_cost NUMERIC(10, 2) NOT NULL,
  platform_margin NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  payment_status VARCHAR(50) DEFAULT 'PENDING',
  payment_id VARCHAR(100),
  phlebo_name VARCHAR(255) DEFAULT 'Assigned on Dispatch',
  phlebo_phone VARCHAR(15) DEFAULT '--',
  report_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
