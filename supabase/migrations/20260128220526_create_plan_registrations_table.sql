/*
  # Create Plan Registrations Table

  ## Purpose
  Store customer information when they register interest in purchasing a pricing plan from the landing page.

  1. New Tables
    - plan_registrations table with customer details, plan selection, and status tracking

  2. Security
    - Enable RLS on plan_registrations table
    - Add policy for admin users to view all registrations
    - Add policy for anonymous users to insert their own registration
*/

CREATE TABLE IF NOT EXISTS plan_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company_name text,
  plan_name text NOT NULL CHECK (plan_name IN ('BASIC', 'GROWTH', 'PRO')),
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  plan_price numeric NOT NULL DEFAULT 0,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE plan_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all plan registrations"
  ON plan_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admin users can update plan registrations"
  ON plan_registrations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Anyone can insert plan registration"
  ON plan_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_plan_registrations_status ON plan_registrations(status);
CREATE INDEX IF NOT EXISTS idx_plan_registrations_created_at ON plan_registrations(created_at DESC);