CREATE TABLE dashboard_users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('starter', 'professional', 'enterprise')),
  token_hash VARCHAR(64) NOT NULL REFERENCES tokens(token_hash),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_dashboard_users_email ON dashboard_users(email);
CREATE INDEX idx_dashboard_users_token ON dashboard_users(token_hash);
CREATE INDEX idx_dashboard_users_plan ON dashboard_users(plan_type);

CREATE TABLE stores (
  store_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  store_name VARCHAR(255) NOT NULL,
  address TEXT,
  phone_number VARCHAR(50),
  store_type VARCHAR(50), -- 'online', 'offline', 'both'
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_stores_user ON stores(user_id);
CREATE INDEX idx_stores_active ON stores(is_active);

CREATE TABLE store_roles (
  role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'staff', 'viewer')),
  assigned_by UUID NOT NULL REFERENCES dashboard_users(user_id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, user_email)
);

CREATE INDEX idx_store_roles_store ON store_roles(store_id);
CREATE INDEX idx_store_roles_email ON store_roles(user_email);

CREATE TABLE transactions (
  transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(store_id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(15,2) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_store ON transactions(store_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_category ON transactions(category);

CREATE TABLE photo_jobs (
  job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(store_id) ON DELETE SET NULL,
  batch_id UUID, -- For batch processing
  original_url TEXT NOT NULL,
  enhanced_url TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('queued', 'processing', 'completed', 'failed')) DEFAULT 'queued',
  enhancements TEXT[], -- Array of enhancement types
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_photo_jobs_user ON photo_jobs(user_id);
CREATE INDEX idx_photo_jobs_store ON photo_jobs(store_id);
CREATE INDEX idx_photo_jobs_batch ON photo_jobs(batch_id);
CREATE INDEX idx_photo_jobs_status ON photo_jobs(status);

CREATE TABLE batch_jobs (
  batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  total_images INTEGER NOT NULL,
  completed_images INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL CHECK (status IN ('processing', 'completed', 'failed')) DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_batch_jobs_user ON batch_jobs(user_id);
CREATE INDEX idx_batch_jobs_status ON batch_jobs(status);

CREATE TABLE label_templates (
  template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL, -- Template configuration
  preview_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_label_templates_active ON label_templates(is_active);

CREATE TABLE generated_labels (
  label_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(store_id) ON DELETE SET NULL,
  template_id UUID REFERENCES label_templates(template_id) ON DELETE SET NULL,
  label_data JSONB NOT NULL, -- Actual label content
  format VARCHAR(10) NOT NULL CHECK (format IN ('pdf', 'png')) DEFAULT 'pdf',
  download_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generated_labels_user ON generated_labels(user_id);
CREATE INDEX idx_generated_labels_store ON generated_labels(store_id);

CREATE TABLE label_presets (
  preset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  preset_name VARCHAR(255) NOT NULL,
  template_id UUID REFERENCES label_templates(template_id) ON DELETE SET NULL,
  label_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_label_presets_user ON label_presets(user_id);

CREATE TABLE whatsapp_connections (
  connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(store_id) ON DELETE SET NULL,
  phone_number VARCHAR(50) NOT NULL,
  api_key TEXT, -- Encrypted WhatsApp API key
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'error')) DEFAULT 'active',
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_whatsapp_connections_user ON whatsapp_connections(user_id);
CREATE INDEX idx_whatsapp_connections_store ON whatsapp_connections(store_id);

CREATE TABLE product_catalog (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(store_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  sku VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_product_catalog_user ON product_catalog(user_id);
CREATE INDEX idx_product_catalog_store ON product_catalog(store_id);
CREATE INDEX idx_product_catalog_active ON product_catalog(is_active);

CREATE TABLE chat_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(store_id) ON DELETE SET NULL,
  customer_phone VARCHAR(50),
  customer_message TEXT NOT NULL,
  ai_reply TEXT NOT NULL,
  context JSONB, -- Additional context data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_logs_user ON chat_logs(user_id);
CREATE INDEX idx_chat_logs_store ON chat_logs(store_id);
CREATE INDEX idx_chat_logs_date ON chat_logs(created_at);

CREATE TABLE reply_templates (
  template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  template_name VARCHAR(255) NOT NULL,
  template_text TEXT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reply_templates_user ON reply_templates(user_id);
CREATE INDEX idx_reply_templates_category ON reply_templates(category);

CREATE TABLE order_items (
  item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(store_id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_user ON order_items(user_id);
CREATE INDEX idx_order_items_store ON order_items(store_id);
CREATE INDEX idx_order_items_date ON order_items(created_at);

CREATE TABLE usage_tracking (
  tracking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES dashboard_users(user_id) ON DELETE CASCADE,
  api_calls INTEGER DEFAULT 0,
  photos_processed INTEGER DEFAULT 0,
  labels_generated INTEGER DEFAULT 0,
  ai_replies_generated INTEGER DEFAULT 0,
  reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- For monthly quotas
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

CREATE INDEX idx_usage_tracking_user ON usage_tracking(user_id);

CREATE TABLE admin_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  token_hash VARCHAR(64),
  user_id UUID,
  reason TEXT,
  metadata JSONB,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_date ON admin_logs(performed_at);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_catalog_updated_at BEFORE UPDATE ON product_catalog
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at BEFORE UPDATE ON usage_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE dashboard_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Policies: Service key bypasses RLS, but can add user-level policies later
CREATE POLICY "Service can access all dashboard_users" ON dashboard_users
  FOR ALL USING (true);

CREATE POLICY "Service can access all stores" ON stores
  FOR ALL USING (true);

CREATE POLICY "Service can access all transactions" ON transactions
  FOR ALL USING (true);

-- Insert default label templates
INSERT INTO label_templates (template_id, name, description, template_data, is_active) VALUES
  (gen_random_uuid(), 'Basic Product Label', 'Simple product label with name and price',
   '{"width": 100, "height": 50, "fields": ["productName", "price", "barcode"]}', true),
  (gen_random_uuid(), 'Shipping Label', 'Standard shipping label with address',
   '{"width": 150, "height": 100, "fields": ["recipientName", "address", "trackingNumber"]}', true),
  (gen_random_uuid(), 'Price Tag', 'Small price tag for retail',
   '{"width": 80, "height": 40, "fields": ["productName", "price"]}', true);

-- Composite indexes for common queries
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_photo_jobs_user_status ON photo_jobs(user_id, status);
CREATE INDEX idx_chat_logs_user_date ON chat_logs(user_id, created_at DESC);

-- Ensure positive amounts
ALTER TABLE transactions ADD CONSTRAINT positive_amount CHECK (amount > 0);
ALTER TABLE product_catalog ADD CONSTRAINT positive_price CHECK (price >= 0);
ALTER TABLE product_catalog ADD CONSTRAINT non_negative_stock CHECK (stock >= 0);
COMMENT ON TABLE dashboard_users IS 'Users who have redeemed tokens and can access the dashboard';
COMMENT ON TABLE stores IS 'Multi-store support for users with Professional/Enterprise plans';
COMMENT ON TABLE transactions IS 'Financial transactions for bookkeeping feature';
COMMENT ON TABLE photo_jobs IS 'Photo enhancement job queue';
COMMENT ON TABLE generated_labels IS 'History of generated shipping/product labels';
COMMENT ON TABLE product_catalog IS 'Product catalog for WhatsApp AI and analytics';
COMMENT ON TABLE chat_logs IS 'WhatsApp AI conversation logs';
COMMENT ON TABLE usage_tracking IS 'Track API usage against plan limits';