-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT true,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('borrow', 'return')),
  quantity INTEGER NOT NULL,
  item_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create damages table
CREATE TABLE IF NOT EXISTS damages (
  id BIGSERIAL PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  item TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_student_id ON transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_transactions_item_name ON transactions(item_name);
CREATE INDEX IF NOT EXISTS idx_damages_student_id ON damages(student_id);
