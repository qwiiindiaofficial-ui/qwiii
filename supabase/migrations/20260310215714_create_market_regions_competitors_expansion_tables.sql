/*
  # Create Market Intelligence Tables

  ## Overview
  Creates three new tables to power the Global Markets page with real, editable data
  instead of hardcoded placeholder values. Each table is scoped per user (user_id).

  ## New Tables

  ### market_regions
  Stores regional market performance data.
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → auth.users)
  - `name` (text) - Region name (e.g. "North India")
  - `cities` (text[]) - Key cities in the region
  - `revenue` (numeric) - Annual revenue in INR
  - `buyers` (integer) - Number of active buyers
  - `growth` (numeric) - YoY growth percentage
  - `potential` (text) - high / medium / low
  - `market_share` (numeric) - Market share percentage
  - `created_at`, `updated_at`

  ### market_competitors
  Stores competitor analysis data.
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → auth.users)
  - `name` (text) - Competitor or brand name
  - `market_share` (numeric) - Market share percentage
  - `strength` (text) - Key competitive strength
  - `weakness` (text) - Key competitive weakness
  - `is_own_brand` (boolean) - Whether this row represents the user's own brand
  - `created_at`, `updated_at`

  ### market_expansion_targets
  Stores cities/markets identified for expansion.
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → auth.users)
  - `city` (text)
  - `state` (text)
  - `population` (text) - Human-readable population string
  - `monthly_potential` (text) - Estimated revenue potential per month
  - `competition_level` (text) - Low / Medium / High
  - `priority` (text) - high / medium / low
  - `strategy` (text) - dealer / franchise / direct / online
  - `budget` (numeric) - Initial expansion budget in INR
  - `timeline` (text) - 1m / 3m / 6m / 1y
  - `notes` (text)
  - `status` (text) - planned / active / completed
  - `created_at`, `updated_at`

  ## Security
  - RLS enabled on all three tables
  - Users can only view, insert, update, delete their own rows
*/

-- market_regions
CREATE TABLE IF NOT EXISTS market_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  cities text[] NOT NULL DEFAULT '{}',
  revenue numeric NOT NULL DEFAULT 0,
  buyers integer NOT NULL DEFAULT 0,
  growth numeric NOT NULL DEFAULT 0,
  potential text NOT NULL DEFAULT 'medium',
  market_share numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE market_regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own regions"
  ON market_regions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own regions"
  ON market_regions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own regions"
  ON market_regions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own regions"
  ON market_regions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_market_regions_user_id ON market_regions(user_id);

-- market_competitors
CREATE TABLE IF NOT EXISTS market_competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  market_share numeric NOT NULL DEFAULT 0,
  strength text NOT NULL DEFAULT '',
  weakness text NOT NULL DEFAULT '',
  is_own_brand boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE market_competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own competitors"
  ON market_competitors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own competitors"
  ON market_competitors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own competitors"
  ON market_competitors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own competitors"
  ON market_competitors FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_market_competitors_user_id ON market_competitors(user_id);

-- market_expansion_targets
CREATE TABLE IF NOT EXISTS market_expansion_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city text NOT NULL,
  state text NOT NULL,
  population text NOT NULL DEFAULT '',
  monthly_potential text NOT NULL DEFAULT '',
  competition_level text NOT NULL DEFAULT 'Medium',
  priority text NOT NULL DEFAULT 'medium',
  strategy text NOT NULL DEFAULT 'dealer',
  budget numeric DEFAULT 0,
  timeline text NOT NULL DEFAULT '3m',
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'planned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE market_expansion_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expansion targets"
  ON market_expansion_targets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expansion targets"
  ON market_expansion_targets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expansion targets"
  ON market_expansion_targets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expansion targets"
  ON market_expansion_targets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_market_expansion_targets_user_id ON market_expansion_targets(user_id);
