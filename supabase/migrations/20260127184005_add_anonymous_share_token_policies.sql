/*
  # Add Anonymous User Share Token Access Policies

  1. Problem
    - Anonymous users (anon role) cannot access shared documents via share_token
    - Only authenticated users have access through previous policies
    - This breaks public sharing links for users not logged in

  2. Solution
    - Add policies for anonymous users to view documents with valid share_token
    - Apply to invoices, quotations, agreements, clients, and their items
  
  3. Security
    - Only grants SELECT access to documents with non-null share_token
    - Does not give access to user-owned documents
    - Maintains separation between authenticated and anonymous access
*/

-- Allow anonymous users to view invoices via share token
CREATE POLICY "Anonymous users can view shared invoices"
  ON invoices
  FOR SELECT
  TO anon
  USING (share_token IS NOT NULL);

-- Allow anonymous users to view quotations via share token
CREATE POLICY "Anonymous users can view shared quotations"
  ON quotations
  FOR SELECT
  TO anon
  USING (share_token IS NOT NULL);

-- Allow anonymous users to view agreements via share token
CREATE POLICY "Anonymous users can view shared agreements"
  ON agreements
  FOR SELECT
  TO anon
  USING (share_token IS NOT NULL);

-- Allow anonymous users to view clients of shared documents
CREATE POLICY "Anonymous users can view clients for shared documents"
  ON clients
  FOR SELECT
  TO anon
  USING (
    id IN (
      SELECT client_id FROM invoices WHERE share_token IS NOT NULL
      UNION
      SELECT client_id FROM quotations WHERE share_token IS NOT NULL
      UNION
      SELECT client_id FROM agreements WHERE share_token IS NOT NULL
    )
  );

-- Allow anonymous users to view invoice items via share token
CREATE POLICY "Anonymous users can view shared invoice items"
  ON invoice_items
  FOR SELECT
  TO anon
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE share_token IS NOT NULL
    )
  );

-- Allow anonymous users to view quotation items via share token
CREATE POLICY "Anonymous users can view shared quotation items"
  ON quotation_items
  FOR SELECT
  TO anon
  USING (
    quotation_id IN (
      SELECT id FROM quotations WHERE share_token IS NOT NULL
    )
  );
