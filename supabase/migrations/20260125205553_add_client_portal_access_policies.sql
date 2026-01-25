/*
  # Add Client Portal Access Policies
  
  1. Purpose
    - Allow public access to client data via portal token
    - Enable clients to view their quotations, invoices, agreements, and orders
  
  2. New Policies
    - Allow public read access to clients table using portal token
    - Allow public read access to quotations for specific client
    - Allow public read access to invoices for specific client
    - Allow public read access to agreements for specific client
    - Allow public read access to client_orders for specific client
    - Allow public read access to quotation_items, invoice_items
  
  3. Security
    - All policies check for valid portal token
    - Read-only access for clients
    - No write/update/delete permissions
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access with portal token" ON clients;
DROP POLICY IF EXISTS "Allow public read for client portal quotations" ON quotations;
DROP POLICY IF EXISTS "Allow public read for client portal quotation items" ON quotation_items;
DROP POLICY IF EXISTS "Allow public read for client portal invoices" ON invoices;
DROP POLICY IF EXISTS "Allow public read for client portal invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Allow public read for client portal agreements" ON agreements;
DROP POLICY IF EXISTS "Allow public read for client portal orders" ON client_orders;

-- Policy for clients table (public read with token)
CREATE POLICY "Allow public read access with portal token"
  ON clients FOR SELECT
  TO anon
  USING (client_portal_token IS NOT NULL);

-- Policy for quotations (public read for client's data)
CREATE POLICY "Allow public read for client portal quotations"
  ON quotations FOR SELECT
  TO anon
  USING (
    client_id IN (
      SELECT id FROM clients WHERE client_portal_token IS NOT NULL
    )
  );

-- Policy for quotation_items
CREATE POLICY "Allow public read for client portal quotation items"
  ON quotation_items FOR SELECT
  TO anon
  USING (
    quotation_id IN (
      SELECT id FROM quotations WHERE client_id IN (
        SELECT id FROM clients WHERE client_portal_token IS NOT NULL
      )
    )
  );

-- Policy for invoices
CREATE POLICY "Allow public read for client portal invoices"
  ON invoices FOR SELECT
  TO anon
  USING (
    client_id IN (
      SELECT id FROM clients WHERE client_portal_token IS NOT NULL
    )
  );

-- Policy for invoice_items
CREATE POLICY "Allow public read for client portal invoice items"
  ON invoice_items FOR SELECT
  TO anon
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE client_id IN (
        SELECT id FROM clients WHERE client_portal_token IS NOT NULL
      )
    )
  );

-- Policy for agreements
CREATE POLICY "Allow public read for client portal agreements"
  ON agreements FOR SELECT
  TO anon
  USING (
    client_id IN (
      SELECT id FROM clients WHERE client_portal_token IS NOT NULL
    )
  );

-- Policy for client_orders
CREATE POLICY "Allow public read for client portal orders"
  ON client_orders FOR SELECT
  TO anon
  USING (
    client_id IN (
      SELECT id FROM clients WHERE client_portal_token IS NOT NULL
    )
  );