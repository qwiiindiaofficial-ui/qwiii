/*
  # Create Market Opportunities Table

  ## Overview
  Creates a table to store AI-generated business opportunities for the Global Markets page.
  Each business owner (user) gets a personalized feed of actionable market opportunities.

  ## New Tables

  ### market_opportunities
  Stores AI-generated market insights and business opportunities per user.

  - `id` (uuid, PK) - Unique identifier
  - `user_id` (uuid, FK → auth.users) - Owner of the opportunity
  - `type` (text) - Category: seasonal_demand, untapped_region, product_gap, buyer_reengagement, export_window, competitor_weakness
  - `priority` (text) - high / medium / low
  - `title` (text) - Short headline of the opportunity
  - `description` (text) - AI explanation (2-4 sentences)
  - `estimated_impact` (text) - Estimated revenue or business impact (e.g. "₹12L/month")
  - `action_label` (text) - Label for CTA button (e.g. "Plan Expansion")
  - `action_type` (text) - Navigation hint: expand, contact_buyers, view_region, etc.
  - `action_payload` (jsonb) - Extra data for the action (e.g. city, region, segment)
  - `timeline_days` (integer) - Days within which to act for best impact
  - `status` (text) - new / actioned / dismissed
  - `expires_at` (timestamptz) - When this opportunity expires/becomes stale
  - `created_at` (timestamptz) - When the opportunity was generated
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - RLS enabled
  - Users can only read, update and delete their own opportunities
  - Insert restricted to authenticated users (for user-triggered generation)
  - Service role inserts handled by edge function (bypasses RLS)
*/

CREATE TABLE IF NOT EXISTS market_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'general',
  priority text NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  description text NOT NULL,
  estimated_impact text,
  action_label text,
  action_type text,
  action_payload jsonb,
  timeline_days integer DEFAULT 30,
  status text NOT NULL DEFAULT 'new',
  expires_at timestamptz DEFAULT (now() + interval '30 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE market_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own opportunities"
  ON market_opportunities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own opportunities"
  ON market_opportunities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own opportunities"
  ON market_opportunities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own opportunities"
  ON market_opportunities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_market_opportunities_user_id ON market_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_market_opportunities_status ON market_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_market_opportunities_priority ON market_opportunities(priority);
CREATE INDEX IF NOT EXISTS idx_market_opportunities_expires_at ON market_opportunities(expires_at);
