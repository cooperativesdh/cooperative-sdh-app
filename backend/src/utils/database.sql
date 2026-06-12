-- Create Tables

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    cooperative_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cooperatives (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    responsible_name VARCHAR(255),
    responsible_cni VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    cooperative_id INTEGER NOT NULL REFERENCES cooperatives(id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    place_of_birth VARCHAR(255),
    nationality VARCHAR(100),
    cni_number VARCHAR(50),
    address TEXT,
    profession VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES members(id),
    cooperative_id INTEGER NOT NULL REFERENCES cooperatives(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    motif VARCHAR(100),
    month_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discharge_documents (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id),
    member_id INTEGER NOT NULL REFERENCES members(id),
    cooperative_id INTEGER NOT NULL REFERENCES cooperatives(id),
    document_path VARCHAR(255),
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    signed BOOLEAN DEFAULT FALSE
);

-- Create Indexes
CREATE INDEX idx_members_cooperative ON members(cooperative_id);
CREATE INDEX idx_payments_member ON payments(member_id);
CREATE INDEX idx_payments_cooperative ON payments(cooperative_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_admins_cooperative ON admins(cooperative_id);
