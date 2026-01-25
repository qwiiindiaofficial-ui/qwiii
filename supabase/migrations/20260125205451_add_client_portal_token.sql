/*
  # Add Client Portal Token
  
  1. Changes
    - Add `client_portal_token` column to clients table
      - Unique token for each client to access their portal
      - Generated automatically using gen_random_uuid()
    
  2. Security
    - Token is unique and indexed for fast lookups
    - Allows clients to access their data without authentication
*/

-- Add client_portal_token column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'client_portal_token'
  ) THEN
    ALTER TABLE clients ADD COLUMN client_portal_token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex');
    CREATE INDEX IF NOT EXISTS idx_clients_portal_token ON clients(client_portal_token);
  END IF;
END $$;