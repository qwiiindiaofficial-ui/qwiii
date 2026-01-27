/*
  # Improve Share Token RLS - Explicit Client Access

  1. Problem
    - Nested client access through share token queries may be blocked
    - Anon users can see invoices but may not see related clients in nested queries
  
  2. Solution
    - Add explicit policies for anon role (not just checking existence)
    - Ensure anon users can view clients when accessed through shared documents
*/

-- Make sure anon users can explicitly access any client data for shared documents
CREATE POLICY "Anon can view clients in shared invoices"
  ON clients
  FOR SELECT
  TO anon
  USING (
    id IN (SELECT client_id FROM invoices WHERE share_token IS NOT NULL)
  );

CREATE POLICY "Anon can view clients in shared quotations"
  ON clients
  FOR SELECT
  TO anon
  USING (
    id IN (SELECT client_id FROM quotations WHERE share_token IS NOT NULL)
  );

CREATE POLICY "Anon can view clients in shared agreements"
  ON clients
  FOR SELECT
  TO anon
  USING (
    id IN (SELECT client_id FROM agreements WHERE share_token IS NOT NULL)
  );

-- Ensure anon users can access invoice items for shared invoices
CREATE POLICY "Anon can view items in shared invoices"
  ON invoice_items
  FOR SELECT
  TO anon
  USING (
    invoice_id IN (SELECT id FROM invoices WHERE share_token IS NOT NULL)
  );

-- Ensure anon users can access quotation items for shared quotations
CREATE POLICY "Anon can view items in shared quotations"
  ON quotation_items
  FOR SELECT
  TO anon
  USING (
    quotation_id IN (SELECT id FROM quotations WHERE share_token IS NOT NULL)
  );
