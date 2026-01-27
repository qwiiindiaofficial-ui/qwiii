/*
  # Fix Share Token RLS Policies
  
  1. Problem
    - Current policies allow viewing ANY document with a share_token set
    - Should only allow viewing the specific document with the requested share_token
    - This requires passing the share_token in the query context
  
  2. Solution
    - Drop old permissive policies
    - Create new policies that accept share_token as a parameter
    - Use Supabase request headers to pass the share token
    - Verify token matches exactly
  
  3. Implementation
    - Use X-Share-Token header to pass the share token
    - Policies check if provided token matches document token
*/

-- Drop old permissive policies
DROP POLICY IF EXISTS "Public can view invoices with valid share token" ON invoices;
DROP POLICY IF EXISTS "Public can view agreements with valid share token" ON agreements;
DROP POLICY IF EXISTS "Public can view quotations with valid share token" ON quotations;
DROP POLICY IF EXISTS "Public can view client data for shared documents" ON clients;
DROP POLICY IF EXISTS "Anonymous users can view shared invoices" ON invoices;
DROP POLICY IF EXISTS "Anonymous users can view shared quotations" ON quotations;
DROP POLICY IF EXISTS "Anonymous users can view shared agreements" ON agreements;
DROP POLICY IF EXISTS "Anonymous users can view clients for shared documents" ON clients;
DROP POLICY IF EXISTS "Anonymous users can view shared invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Anonymous users can view shared quotation items" ON quotation_items;
DROP POLICY IF EXISTS "Authenticated users can view shared invoices" ON invoices;
DROP POLICY IF EXISTS "Authenticated users can view shared quotations" ON quotations;
DROP POLICY IF EXISTS "Authenticated users can view shared agreements" ON agreements;
DROP POLICY IF EXISTS "Authenticated users can view clients for shared documents" ON clients;
DROP POLICY IF EXISTS "Authenticated users can view shared invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Authenticated users can view shared quotation items" ON quotation_items;

-- New policies for share token access - anonymous users
CREATE POLICY "Anyone can view invoice by share token"
  ON invoices
  FOR SELECT
  USING (share_token = current_setting('app.share_token', true)::uuid);

CREATE POLICY "Anyone can view quotation by share token"
  ON quotations
  FOR SELECT
  USING (share_token = current_setting('app.share_token', true)::uuid);

CREATE POLICY "Anyone can view agreement by share token"
  ON agreements
  FOR SELECT
  USING (share_token = current_setting('app.share_token', true)::uuid);

-- Client access for shared documents
CREATE POLICY "Anyone can view client for shared invoice"
  ON clients
  FOR SELECT
  USING (
    id IN (
      SELECT client_id FROM invoices 
      WHERE share_token = current_setting('app.share_token', true)::uuid
      UNION
      SELECT client_id FROM quotations 
      WHERE share_token = current_setting('app.share_token', true)::uuid
      UNION
      SELECT client_id FROM agreements 
      WHERE share_token = current_setting('app.share_token', true)::uuid
    )
  );

-- Invoice items access
CREATE POLICY "Anyone can view invoice items by share token"
  ON invoice_items
  FOR SELECT
  USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE share_token = current_setting('app.share_token', true)::uuid
    )
  );

-- Quotation items access
CREATE POLICY "Anyone can view quotation items by share token"
  ON quotation_items
  FOR SELECT
  USING (
    quotation_id IN (
      SELECT id FROM quotations 
      WHERE share_token = current_setting('app.share_token', true)::uuid
    )
  );
