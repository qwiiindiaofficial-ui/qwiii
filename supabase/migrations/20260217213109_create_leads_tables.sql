/*
  # Create leads management tables

  1. New Tables:
    - `leads` - Stores lead information with AI-generated insights
    - `lead_sources` - Configuration for lead generation sources
    - `lead_generation_logs` - Audit trail of lead generation runs
    - `lead_activities` - Track interactions with leads

  2. Security:
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text,
  company_name text NOT NULL,
  phone text,
  email text,
  address text,
  city text,
  state text,
  pincode text,
  country text DEFAULT 'India',
  latitude numeric,
  longitude numeric,
  industry text,
  business_type text,
  company_size text,
  website text,
  google_rating numeric,
  google_reviews_count integer,
  google_place_id text,
  normalized_phone text,
  ai_insights text,
  potential_sticker_needs text[],
  estimated_order_value numeric,
  suggested_pitch text,
  score integer DEFAULT 50,
  confidence_level text DEFAULT 'medium',
  priority text DEFAULT 'warm',
  status text DEFAULT 'new',
  assigned_to_user_id uuid REFERENCES auth.users(id),
  converted_to_client_id uuid,
  source text DEFAULT 'manual',
  search_query text,
  source_url text,
  notes text,
  last_contact_date timestamp with time zone,
  follow_up_date timestamp with time zone,
  contact_attempts integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lead_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  industry_name text NOT NULL,
  search_keywords text[],
  target_locations text[] DEFAULT ARRAY['Mumbai'],
  is_active boolean DEFAULT true,
  priority integer DEFAULT 1,
  day_of_week integer,
  description text,
  total_leads_generated integer DEFAULT 0,
  last_used_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lead_generation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  status text DEFAULT 'running',
  leads_generated integer DEFAULT 0,
  search_query text,
  target_industry text,
  target_location text,
  google_maps_calls integer DEFAULT 0,
  groq_calls integer DEFAULT 0,
  gemini_calls integer DEFAULT 0,
  duration_seconds numeric,
  success_rate numeric,
  error_message text,
  run_date timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  activity_type text NOT NULL,
  notes text,
  outcome text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads"
  ON leads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own lead sources"
  ON lead_sources FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert lead sources"
  ON lead_sources FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead sources"
  ON lead_sources FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own generation logs"
  ON lead_generation_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert generation logs"
  ON lead_generation_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generation logs"
  ON lead_generation_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view activities on their leads"
  ON lead_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads WHERE leads.id = lead_activities.lead_id AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert activities on their leads"
  ON lead_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads WHERE leads.id = lead_id AND leads.user_id = auth.uid()
    ) AND auth.uid() = user_id
  );

CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_google_place_id ON leads(google_place_id);
CREATE INDEX idx_leads_normalized_phone ON leads(normalized_phone);
CREATE INDEX idx_lead_sources_user_id ON lead_sources(user_id);
CREATE INDEX idx_lead_generation_logs_user_id ON lead_generation_logs(user_id);
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);