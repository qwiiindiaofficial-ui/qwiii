/*
  # Create Company Profile Table

  ## Summary
  Stores company/business profile data for each user account. This data is used
  as the "first party" (sender) in invoices, quotations, agreements, and other documents.

  ## New Tables
  - `company_profiles`
    - `id` (uuid, primary key)
    - `user_id` (uuid, unique, references auth.users)
    - `company_name` (text) - Official business name
    - `display_name` (text) - Name shown on documents
    - `logo_url` (text) - URL to uploaded logo image
    - `tagline` (text) - Company tagline/slogan
    - `email` (text) - Business email
    - `phone` (text) - Primary phone number
    - `website` (text) - Website URL
    - `address_line1` (text) - Street address
    - `address_line2` (text) - Suite / floor / etc
    - `city` (text)
    - `state` (text)
    - `pincode` (text)
    - `country` (text, default 'India')
    - `gst_number` (text) - GST registration number
    - `pan_number` (text) - PAN number
    - `cin_number` (text) - Corporate identification number
    - `bank_name` (text) - Bank name for payment details
    - `bank_account` (text) - Account number
    - `bank_ifsc` (text) - IFSC code
    - `bank_branch` (text) - Branch name
    - `invoice_prefix` (text, default 'INV') - Prefix for invoice numbers
    - `quotation_prefix` (text, default 'QT') - Prefix for quotation numbers
    - `agreement_prefix` (text, default 'AGR') - Prefix for agreement numbers
    - `currency` (text, default 'INR')
    - `signature_url` (text) - URL to signature image
    - `terms_and_conditions` (text) - Default T&C for invoices
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled with per-user access only
  - Users can only read/write their own profile
*/

CREATE TABLE IF NOT EXISTS company_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL DEFAULT '',
  display_name text DEFAULT '',
  logo_url text DEFAULT '',
  tagline text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  website text DEFAULT '',
  address_line1 text DEFAULT '',
  address_line2 text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  pincode text DEFAULT '',
  country text DEFAULT 'India',
  gst_number text DEFAULT '',
  pan_number text DEFAULT '',
  cin_number text DEFAULT '',
  bank_name text DEFAULT '',
  bank_account text DEFAULT '',
  bank_ifsc text DEFAULT '',
  bank_branch text DEFAULT '',
  invoice_prefix text DEFAULT 'INV',
  quotation_prefix text DEFAULT 'QT',
  agreement_prefix text DEFAULT 'AGR',
  currency text DEFAULT 'INR',
  signature_url text DEFAULT '',
  terms_and_conditions text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own company profile"
  ON company_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own company profile"
  ON company_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own company profile"
  ON company_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own company profile"
  ON company_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
