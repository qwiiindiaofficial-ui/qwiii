/*
  # Create Operations Tables

  ## Summary
  Creates all tables needed for the Operations, Management, and Notification modules:
  - inventory_items: Product SKU tracking with stock levels and reorder alerts
  - production_batches: Manufacturing batch scheduling and progress tracking
  - production_machines: Machine status and efficiency monitoring
  - supply_chain_vendors: Vendor directory with ratings
  - supply_chain_shipments: Shipment tracking with status
  - supply_chain_orders: Purchase orders to vendors
  - quality_inspections: QC inspection records linked to batches
  - buyers: B2B buyer CRM (separate from clients, focused on B2B wholesale)
  - notifications: User notification feed (real activity log for frontend)
  - alerts: System-level alerts (stock, demand, payments)
  - digital_signatures: E-signature request tracking linked to agreements/invoices

  ## Security
  - RLS enabled on all tables
  - Authenticated users can only see/modify their own records (user_id = auth.uid())
*/

-- ========================
-- INVENTORY ITEMS
-- ========================
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sku text NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  stock integer NOT NULL DEFAULT 0,
  reorder_level integer NOT NULL DEFAULT 10,
  price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'in_stock',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inventory"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON inventory_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
  ON inventory_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory"
  ON inventory_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_inventory_items_user_id ON inventory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_status ON inventory_items(status);

-- ========================
-- PRODUCTION BATCHES
-- ========================
CREATE TABLE IF NOT EXISTS production_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  batch_number text NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  completed integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'scheduled',
  priority text NOT NULL DEFAULT 'normal',
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE production_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own batches"
  ON production_batches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own batches"
  ON production_batches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own batches"
  ON production_batches FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own batches"
  ON production_batches FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_production_batches_user_id ON production_batches(user_id);

-- ========================
-- PRODUCTION MACHINES
-- ========================
CREATE TABLE IF NOT EXISTS production_machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  machine_id text NOT NULL,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'idle',
  efficiency integer NOT NULL DEFAULT 0,
  current_batch_id uuid REFERENCES production_batches(id) ON DELETE SET NULL,
  operator text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE production_machines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own machines"
  ON production_machines FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own machines"
  ON production_machines FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own machines"
  ON production_machines FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own machines"
  ON production_machines FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========================
-- SUPPLY CHAIN VENDORS
-- ========================
CREATE TABLE IF NOT EXISTS supply_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  contact_person text,
  phone text,
  email text,
  location text,
  rating numeric NOT NULL DEFAULT 0,
  total_orders integer NOT NULL DEFAULT 0,
  on_time_percent integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE supply_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vendors"
  ON supply_vendors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vendors"
  ON supply_vendors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vendors"
  ON supply_vendors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own vendors"
  ON supply_vendors FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========================
-- SUPPLY CHAIN SHIPMENTS
-- ========================
CREATE TABLE IF NOT EXISTS supply_shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shipment_number text NOT NULL,
  buyer_name text NOT NULL,
  origin text,
  destination text,
  items_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'processing',
  carrier text,
  tracking_number text,
  eta text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE supply_shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shipments"
  ON supply_shipments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shipments"
  ON supply_shipments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shipments"
  ON supply_shipments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shipments"
  ON supply_shipments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========================
-- SUPPLY CHAIN PURCHASE ORDERS
-- ========================
CREATE TABLE IF NOT EXISTS supply_purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES supply_vendors(id) ON DELETE SET NULL,
  vendor_name text NOT NULL,
  material text NOT NULL,
  quantity text NOT NULL,
  estimated_value numeric,
  urgency text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE supply_purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchase orders"
  ON supply_purchase_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchase orders"
  ON supply_purchase_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own purchase orders"
  ON supply_purchase_orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own purchase orders"
  ON supply_purchase_orders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========================
-- QUALITY INSPECTIONS
-- ========================
CREATE TABLE IF NOT EXISTS quality_inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  inspection_number text NOT NULL,
  batch_id uuid REFERENCES production_batches(id) ON DELETE SET NULL,
  batch_number text NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  passed integer NOT NULL DEFAULT 0,
  failed integer NOT NULL DEFAULT 0,
  defect_type text,
  result text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  assignee text,
  notes text,
  inspected_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quality_inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inspections"
  ON quality_inspections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inspections"
  ON quality_inspections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inspections"
  ON quality_inspections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own inspections"
  ON quality_inspections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========================
-- BUYERS (B2B)
-- ========================
CREATE TABLE IF NOT EXISTS buyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact_person text,
  phone text,
  email text,
  tier text NOT NULL DEFAULT 'Regular',
  total_orders integer NOT NULL DEFAULT 0,
  total_value numeric NOT NULL DEFAULT 0,
  credit_limit numeric NOT NULL DEFAULT 0,
  outstanding_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  notes text,
  last_order_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own buyers"
  ON buyers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own buyers"
  ON buyers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own buyers"
  ON buyers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own buyers"
  ON buyers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_buyers_user_id ON buyers(user_id);

-- ========================
-- NOTIFICATIONS
-- ========================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

-- ========================
-- ALERTS
-- ========================
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  description text,
  resolved boolean NOT NULL DEFAULT false,
  resolved_at timestamptz,
  source text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(user_id, resolved);

-- ========================
-- DIGITAL SIGNATURES
-- ========================
CREATE TABLE IF NOT EXISTS digital_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_type text NOT NULL DEFAULT 'agreement',
  document_number text NOT NULL,
  client_name text NOT NULL,
  client_email text,
  signatory_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at date DEFAULT CURRENT_DATE,
  signed_at date,
  expires_at date,
  signature_link text,
  ip_address text,
  agreement_id uuid REFERENCES agreements(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE digital_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own signatures"
  ON digital_signatures FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own signatures"
  ON digital_signatures FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own signatures"
  ON digital_signatures FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own signatures"
  ON digital_signatures FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_digital_signatures_user_id ON digital_signatures(user_id);
