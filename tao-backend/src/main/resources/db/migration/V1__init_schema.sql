CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    address VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(100),
    private_key_encrypted TEXT NOT NULL,
    network VARCHAR(20) DEFAULT 'bittensor',
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE leaders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    address VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(100),
    remark VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE copy_templates (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    copy_type VARCHAR(20) NOT NULL DEFAULT 'ratio',
    copy_ratio DECIMAL(10,4),
    fixed_amount DECIMAL(30,10),
    daily_loss_limit DECIMAL(30,10),
    max_ops_per_day INT DEFAULT 10,
    slippage_tolerance DECIMAL(5,4) DEFAULT 0.005,
    stake_risk_threshold VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE copy_trades (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    account_id VARCHAR(36) NOT NULL,
    leader_id VARCHAR(36) NOT NULL,
    template_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_account_id (account_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (leader_id) REFERENCES leaders(id),
    FOREIGN KEY (template_id) REFERENCES copy_templates(id)
);

CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    business_type VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    amount DECIMAL(30,10),
    fee DECIMAL(30,10),
    account_id VARCHAR(36),
    leader_id VARCHAR(36),
    copy_trade_id VARCHAR(36),
    user_id VARCHAR(36),
    tx_hash VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_account_id (account_id),
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE positions (
    id VARCHAR(36) PRIMARY KEY,
    account_id VARCHAR(36) NOT NULL,
    asset_type VARCHAR(30) NOT NULL,
    balance DECIMAL(30,10) DEFAULT 0,
    staked DECIMAL(30,10) DEFAULT 0,
    subnet_power DECIMAL(30,10),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_account_id (account_id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE limit_price_rules (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    account_id VARCHAR(36) NOT NULL,
    subnet_name VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL,
    target_price DECIMAL(30,10) NOT NULL,
    current_price DECIMAL(30,10) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_account_id (account_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);
