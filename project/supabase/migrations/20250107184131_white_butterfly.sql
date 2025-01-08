/*
  # Initial Schema for SBV360

  1. New Tables
    - profiles (user profiles with additional data)
    - grants (subvenciones)
    - questions (questionnaire questions)
    - answers (user answers to questions)
    - subscriptions (organization subscription plans)
    - advertisements (platform ads)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Profiles table for additional user data
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  company_name text,
  tax_id text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Grants (Subvenciones) table
CREATE TABLE IF NOT EXISTS grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  organization text NOT NULL,
  requirements text[],
  start_date timestamptz,
  end_date timestamptz,
  status text DEFAULT 'active',
  category text[],
  amount numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Questions table for the questionnaire
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options jsonb,
  type text NOT NULL,
  category text,
  order_number integer,
  created_at timestamptz DEFAULT now()
);

-- User answers to questions
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  question_id uuid REFERENCES questions(id),
  answer jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  features jsonb,
  duration interval NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Advertisements
CREATE TABLE IF NOT EXISTS advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  image_url text,
  url text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

-- Policies

-- Profiles: users can read all profiles but only update their own
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Grants: anyone can read, only admins can modify
CREATE POLICY "Anyone can read grants"
  ON grants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can modify grants"
  ON grants FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ));

-- Questions: anyone can read, only admins can modify
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can modify questions"
  ON questions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ));

-- Answers: users can read/write their own answers
CREATE POLICY "Users can manage their own answers"
  ON answers FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Subscriptions: anyone can read, only admins can modify
CREATE POLICY "Anyone can read subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can modify subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ));

-- Advertisements: anyone can read active ads, only admins can modify
CREATE POLICY "Anyone can read active advertisements"
  ON advertisements FOR SELECT
  TO authenticated
  USING (status = 'active' AND current_timestamp BETWEEN start_date AND end_date);

CREATE POLICY "Admins can modify advertisements"
  ON advertisements FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ));