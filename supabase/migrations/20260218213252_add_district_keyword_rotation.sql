/*
  # District and Keyword Rotation System

  ## Overview
  This migration sets up the infrastructure for city district rotation and keyword rotation
  in the lead generation system. Instead of always searching the same city center with all
  keywords, each generation run uses the next district and next keyword in sequence, giving
  genuinely different Google Places API results on every run.

  ## New Tables

  ### 1. city_districts
  Stores known neighbourhoods/districts for each of the 20 supported cities.
  - `id` - primary key
  - `city` - name of the city (matches keys in indianCities in lead-scraper)
  - `district_name` - human-readable district/neighbourhood name
  - `lat` / `lng` - district center coordinates (replaces city center in Google Places search)
  - `search_radius` - meters radius for this district (smaller than city radius)
  - `display_order` - controls rotation sequence within a city

  ### 2. lead_search_state
  Tracks rotation progress per user per city per industry. Acts as persistent memory.
  - `user_id` - the user this state belongs to
  - `city` - which city
  - `industry` - which industry keyword group
  - `last_district_index` - index into the ordered districts list; -1 means start from 0
  - `last_keyword_index` - index into the industry keyword array; -1 means start from 0
  - `total_districts` - cached count so we can wrap around correctly
  - `updated_at` - timestamp of last rotation

  ## Modified Tables

  ### lead_generation_logs
  - Added `district_used` column - which district was searched
  - Added `keyword_used` column - which specific keyword string was used

  ## Security
  - RLS enabled on both new tables
  - city_districts is read-only for all authenticated users (seeded by admin)
  - lead_search_state is owned per-user (CRUD restricted to owner)

  ## Notes
  1. city_districts data is seeded inline in this migration (15-30 districts per city)
  2. The rotation logic lives in the edge functions, not the DB
  3. wrap-around is handled in the edge function by modulo on total count
*/

-- ============================================================
-- TABLE: city_districts
-- ============================================================
CREATE TABLE IF NOT EXISTS city_districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  district_name text NOT NULL,
  lat numeric(10, 6) NOT NULL,
  lng numeric(10, 6) NOT NULL,
  search_radius integer NOT NULL DEFAULT 5000,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE city_districts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read city districts"
  ON city_districts FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_city_districts_city ON city_districts(city);
CREATE INDEX IF NOT EXISTS idx_city_districts_city_order ON city_districts(city, display_order);

-- ============================================================
-- TABLE: lead_search_state
-- ============================================================
CREATE TABLE IF NOT EXISTS lead_search_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city text NOT NULL,
  industry text NOT NULL,
  last_district_index integer NOT NULL DEFAULT -1,
  last_keyword_index integer NOT NULL DEFAULT -1,
  total_districts integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, city, industry)
);

ALTER TABLE lead_search_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own search state"
  ON lead_search_state FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search state"
  ON lead_search_state FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own search state"
  ON lead_search_state FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own search state"
  ON lead_search_state FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_lead_search_state_user ON lead_search_state(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_search_state_lookup ON lead_search_state(user_id, city, industry);

-- ============================================================
-- ALTER: lead_generation_logs - add district_used, keyword_used
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lead_generation_logs' AND column_name = 'district_used'
  ) THEN
    ALTER TABLE lead_generation_logs ADD COLUMN district_used text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lead_generation_logs' AND column_name = 'keyword_used'
  ) THEN
    ALTER TABLE lead_generation_logs ADD COLUMN keyword_used text;
  END IF;
END $$;

-- ============================================================
-- SEED: city_districts
-- ============================================================

-- MUMBAI
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Mumbai', 'Andheri', 19.1197, 72.8464, 4000, 1),
  ('Mumbai', 'Bandra', 19.0596, 72.8295, 3500, 2),
  ('Mumbai', 'Borivali', 19.2307, 72.8567, 4000, 3),
  ('Mumbai', 'Dadar', 19.0178, 72.8478, 3000, 4),
  ('Mumbai', 'Goregaon', 19.1663, 72.8526, 4000, 5),
  ('Mumbai', 'Kandivali', 19.2043, 72.8491, 4000, 6),
  ('Mumbai', 'Kurla', 19.0728, 72.8826, 3500, 7),
  ('Mumbai', 'Malad', 19.1871, 72.8486, 4000, 8),
  ('Mumbai', 'Mulund', 19.1724, 72.9568, 3500, 9),
  ('Mumbai', 'Thane', 19.2183, 72.9781, 5000, 10),
  ('Mumbai', 'Vashi', 19.0771, 73.0030, 4000, 11),
  ('Mumbai', 'Chembur', 19.0522, 72.8991, 3500, 12),
  ('Mumbai', 'Ghatkopar', 19.0858, 72.9081, 3500, 13),
  ('Mumbai', 'Vikhroli', 19.1075, 72.9263, 3500, 14),
  ('Mumbai', 'Worli', 19.0178, 72.8148, 3000, 15),
  ('Mumbai', 'Lower Parel', 18.9965, 72.8233, 3000, 16),
  ('Mumbai', 'Powai', 19.1197, 72.9050, 3500, 17),
  ('Mumbai', 'Colaba', 18.9068, 72.8147, 2500, 18)
ON CONFLICT DO NOTHING;

-- DELHI
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Delhi', 'Connaught Place', 28.6315, 77.2167, 3000, 1),
  ('Delhi', 'Karol Bagh', 28.6519, 77.1909, 3500, 2),
  ('Delhi', 'Lajpat Nagar', 28.5677, 77.2433, 3500, 3),
  ('Delhi', 'Dwarka', 28.5921, 77.0460, 5000, 4),
  ('Delhi', 'Rohini', 28.7495, 77.0699, 5000, 5),
  ('Delhi', 'Janakpuri', 28.6289, 77.0878, 4000, 6),
  ('Delhi', 'Saket', 28.5244, 77.2167, 3500, 7),
  ('Delhi', 'Vasant Kunj', 28.5200, 77.1575, 4000, 8),
  ('Delhi', 'Nehru Place', 28.5494, 77.2501, 3000, 9),
  ('Delhi', 'Rajouri Garden', 28.6469, 77.1217, 3500, 10),
  ('Delhi', 'Pitampura', 28.7031, 77.1322, 4000, 11),
  ('Delhi', 'Uttam Nagar', 28.6207, 77.0591, 4000, 12),
  ('Delhi', 'Mayur Vihar', 28.6079, 77.2957, 4000, 13),
  ('Delhi', 'Shahdara', 28.6696, 77.2908, 4000, 14),
  ('Delhi', 'Patel Nagar', 28.6565, 77.1687, 3000, 15),
  ('Delhi', 'Kirti Nagar', 28.6541, 77.1406, 3000, 16),
  ('Delhi', 'Malviya Nagar', 28.5341, 77.2124, 3500, 17),
  ('Delhi', 'Green Park', 28.5590, 77.2048, 3000, 18),
  ('Delhi', 'Hauz Khas', 28.5494, 77.2001, 3000, 19),
  ('Delhi', 'Preet Vihar', 28.6421, 77.3028, 3500, 20)
ON CONFLICT DO NOTHING;

-- BANGALORE
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Bangalore', 'Koramangala', 12.9352, 77.6245, 3500, 1),
  ('Bangalore', 'Indiranagar', 12.9784, 77.6408, 3500, 2),
  ('Bangalore', 'Whitefield', 12.9698, 77.7500, 5000, 3),
  ('Bangalore', 'Jayanagar', 12.9253, 77.5938, 3500, 4),
  ('Bangalore', 'HSR Layout', 12.9116, 77.6389, 4000, 5),
  ('Bangalore', 'BTM Layout', 12.9165, 77.6101, 4000, 6),
  ('Bangalore', 'Rajajinagar', 12.9942, 77.5567, 3500, 7),
  ('Bangalore', 'Malleshwaram', 13.0035, 77.5685, 3500, 8),
  ('Bangalore', 'Hebbal', 13.0358, 77.5970, 4000, 9),
  ('Bangalore', 'Electronic City', 12.8399, 77.6770, 5000, 10),
  ('Bangalore', 'Marathahalli', 12.9591, 77.6974, 4000, 11),
  ('Bangalore', 'Yelahanka', 13.1007, 77.5963, 4000, 12),
  ('Bangalore', 'Bannerghatta Road', 12.8750, 77.5985, 4000, 13),
  ('Bangalore', 'JP Nagar', 12.9063, 77.5857, 4000, 14),
  ('Bangalore', 'Banashankari', 12.9253, 77.5622, 3500, 15)
ON CONFLICT DO NOTHING;

-- PUNE
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Pune', 'Kothrud', 18.5074, 73.8077, 4000, 1),
  ('Pune', 'Hadapsar', 18.5018, 73.9258, 4000, 2),
  ('Pune', 'Baner', 18.5600, 73.7878, 3500, 3),
  ('Pune', 'Hinjewadi', 18.5912, 73.7389, 4000, 4),
  ('Pune', 'Kharadi', 18.5506, 73.9418, 4000, 5),
  ('Pune', 'Wakad', 18.5989, 73.7593, 3500, 6),
  ('Pune', 'Viman Nagar', 18.5679, 73.9143, 3500, 7),
  ('Pune', 'Deccan', 18.5159, 73.8435, 3000, 8),
  ('Pune', 'Camp Area', 18.5080, 73.8747, 3000, 9),
  ('Pune', 'Chinchwad', 18.6280, 73.8010, 4000, 10),
  ('Pune', 'Pimple Saudagar', 18.6075, 73.7880, 3500, 11),
  ('Pune', 'Magarpatta', 18.5124, 73.9308, 3500, 12)
ON CONFLICT DO NOTHING;

-- HYDERABAD
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Hyderabad', 'Banjara Hills', 17.4156, 78.4347, 4000, 1),
  ('Hyderabad', 'Jubilee Hills', 17.4322, 78.4075, 3500, 2),
  ('Hyderabad', 'Madhapur', 17.4484, 78.3908, 4000, 3),
  ('Hyderabad', 'Kondapur', 17.4680, 78.3583, 4000, 4),
  ('Hyderabad', 'Gachibowli', 17.4401, 78.3489, 4000, 5),
  ('Hyderabad', 'Secunderabad', 17.4399, 78.4983, 4000, 6),
  ('Hyderabad', 'Kukatpally', 17.4849, 78.4138, 4000, 7),
  ('Hyderabad', 'Dilsukhnagar', 17.3688, 78.5247, 3500, 8),
  ('Hyderabad', 'LB Nagar', 17.3473, 78.5514, 3500, 9),
  ('Hyderabad', 'Ameerpet', 17.4374, 78.4482, 3000, 10),
  ('Hyderabad', 'SR Nagar', 17.4454, 78.4524, 3000, 11),
  ('Hyderabad', 'Begumpet', 17.4439, 78.4688, 3000, 12)
ON CONFLICT DO NOTHING;

-- CHENNAI
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Chennai', 'Anna Nagar', 13.0850, 80.2101, 4000, 1),
  ('Chennai', 'T Nagar', 13.0418, 80.2341, 3500, 2),
  ('Chennai', 'Adyar', 13.0012, 80.2565, 3500, 3),
  ('Chennai', 'Velachery', 12.9815, 80.2209, 4000, 4),
  ('Chennai', 'Tambaram', 12.9249, 80.1000, 5000, 5),
  ('Chennai', 'Porur', 13.0365, 80.1574, 4000, 6),
  ('Chennai', 'Sholinganallur', 12.9010, 80.2279, 4000, 7),
  ('Chennai', 'OMR', 12.8512, 80.2279, 5000, 8),
  ('Chennai', 'Perambur', 13.1167, 80.2333, 3500, 9),
  ('Chennai', 'Guindy', 13.0067, 80.2206, 3500, 10),
  ('Chennai', 'Nungambakkam', 13.0569, 80.2425, 3000, 11),
  ('Chennai', 'Chromepet', 12.9511, 80.1432, 4000, 12)
ON CONFLICT DO NOTHING;

-- KOLKATA
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Kolkata', 'Salt Lake', 22.5752, 88.4153, 4000, 1),
  ('Kolkata', 'Park Street', 22.5526, 88.3511, 3000, 2),
  ('Kolkata', 'Howrah', 22.5958, 88.2636, 5000, 3),
  ('Kolkata', 'Dum Dum', 22.6375, 88.3980, 4000, 4),
  ('Kolkata', 'Jadavpur', 22.4972, 88.3714, 4000, 5),
  ('Kolkata', 'Tollygunge', 22.4983, 88.3433, 3500, 6),
  ('Kolkata', 'Behala', 22.4953, 88.3143, 4000, 7),
  ('Kolkata', 'Rajarhat', 22.6226, 88.4643, 5000, 8),
  ('Kolkata', 'New Town', 22.5958, 88.4849, 5000, 9),
  ('Kolkata', 'Barasat', 22.7215, 88.4779, 5000, 10)
ON CONFLICT DO NOTHING;

-- JAIPUR
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Jaipur', 'Malviya Nagar', 26.8571, 75.8152, 4000, 1),
  ('Jaipur', 'Vaishali Nagar', 26.9273, 75.7408, 4000, 2),
  ('Jaipur', 'Mansarovar', 26.8561, 75.7605, 4000, 3),
  ('Jaipur', 'C Scheme', 26.9040, 75.8072, 3000, 4),
  ('Jaipur', 'Tonk Road', 26.8726, 75.8266, 3500, 5),
  ('Jaipur', 'Johari Bazaar', 26.9201, 75.8274, 3000, 6),
  ('Jaipur', 'MI Road', 26.9183, 75.8065, 3000, 7),
  ('Jaipur', 'Jagatpura', 26.8256, 75.8445, 4000, 8),
  ('Jaipur', 'Pratap Nagar', 26.8390, 75.8205, 3500, 9),
  ('Jaipur', 'Sanganer', 26.8202, 75.7979, 4000, 10)
ON CONFLICT DO NOTHING;

-- AHMEDABAD
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Ahmedabad', 'Navrangpura', 23.0417, 72.5520, 3500, 1),
  ('Ahmedabad', 'Satellite', 23.0265, 72.5106, 4000, 2),
  ('Ahmedabad', 'Bopal', 23.0196, 72.4694, 4000, 3),
  ('Ahmedabad', 'Maninagar', 22.9947, 72.6050, 4000, 4),
  ('Ahmedabad', 'Naranpura', 23.0580, 72.5536, 3500, 5),
  ('Ahmedabad', 'Vastrapur', 23.0330, 72.5275, 3500, 6),
  ('Ahmedabad', 'Prahlad Nagar', 23.0208, 72.5065, 3500, 7),
  ('Ahmedabad', 'Gota', 23.0925, 72.5434, 4000, 8),
  ('Ahmedabad', 'Chandkheda', 23.1025, 72.5856, 4000, 9),
  ('Ahmedabad', 'Nikol', 23.0347, 72.6453, 4000, 10)
ON CONFLICT DO NOTHING;

-- LUCKNOW
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Lucknow', 'Hazratganj', 26.8467, 80.9462, 3000, 1),
  ('Lucknow', 'Gomti Nagar', 26.8617, 81.0149, 4000, 2),
  ('Lucknow', 'Aliganj', 26.8840, 80.9405, 3500, 3),
  ('Lucknow', 'Indira Nagar', 26.8779, 80.9791, 4000, 4),
  ('Lucknow', 'Rajajipuram', 26.8360, 80.9099, 3500, 5),
  ('Lucknow', 'Alambagh', 26.8133, 80.9197, 3500, 6),
  ('Lucknow', 'Mahanagar', 26.8709, 80.9405, 3500, 7),
  ('Lucknow', 'Chinhat', 26.8660, 81.0553, 4000, 8)
ON CONFLICT DO NOTHING;

-- SURAT
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Surat', 'Adajan', 21.2148, 72.7906, 4000, 1),
  ('Surat', 'Varachha', 21.2093, 72.8714, 4000, 2),
  ('Surat', 'Katargam', 21.2346, 72.8434, 3500, 3),
  ('Surat', 'Althan', 21.1734, 72.8046, 3500, 4),
  ('Surat', 'Pal', 21.1852, 72.7823, 3500, 5),
  ('Surat', 'Piplod', 21.1705, 72.7930, 3500, 6),
  ('Surat', 'Dindoli', 21.1576, 72.8434, 4000, 7),
  ('Surat', 'Udhna', 21.1716, 72.8714, 4000, 8)
ON CONFLICT DO NOTHING;

-- NAGPUR
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Nagpur', 'Dharampeth', 21.1367, 79.0659, 3500, 1),
  ('Nagpur', 'Sitabuldi', 21.1479, 79.0867, 3000, 2),
  ('Nagpur', 'Ramdaspeth', 21.1302, 79.0851, 3000, 3),
  ('Nagpur', 'Manewada', 21.1024, 79.1234, 4000, 4),
  ('Nagpur', 'Hingna', 21.0814, 78.9995, 4000, 5),
  ('Nagpur', 'Ambazari', 21.1425, 79.0425, 3500, 6),
  ('Nagpur', 'Pratap Nagar', 21.1679, 79.0983, 3500, 7),
  ('Nagpur', 'Gandhibagh', 21.1462, 79.0870, 3000, 8)
ON CONFLICT DO NOTHING;

-- INDORE
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Indore', 'Vijay Nagar', 22.7533, 75.9048, 4000, 1),
  ('Indore', 'Palasia', 22.7196, 75.8577, 3000, 2),
  ('Indore', 'Rajwada', 22.7182, 75.8560, 2500, 3),
  ('Indore', 'Scheme 54', 22.7452, 75.9033, 3500, 4),
  ('Indore', 'Bicholi Hapsi', 22.7684, 75.9337, 4000, 5),
  ('Indore', 'Khajrana', 22.7305, 75.9231, 4000, 6),
  ('Indore', 'Annapurna', 22.6834, 75.8638, 3500, 7),
  ('Indore', 'Lasudia', 22.7869, 75.8903, 3500, 8)
ON CONFLICT DO NOTHING;

-- BHOPAL
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Bhopal', 'MP Nagar', 23.2329, 77.4344, 3500, 1),
  ('Bhopal', 'Arera Colony', 23.2018, 77.4421, 3500, 2),
  ('Bhopal', 'Kolar Road', 23.1654, 77.4432, 4000, 3),
  ('Bhopal', 'Hoshangabad Road', 23.1949, 77.4796, 4000, 4),
  ('Bhopal', 'Shahpura', 23.2161, 77.4727, 3500, 5),
  ('Bhopal', 'Ayodhya Nagar', 23.2599, 77.4643, 3500, 6),
  ('Bhopal', 'New Market', 23.2327, 77.4272, 3000, 7),
  ('Bhopal', 'Govindpura', 23.2716, 77.4560, 4000, 8)
ON CONFLICT DO NOTHING;

-- CHANDIGARH
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Chandigarh', 'Sector 17', 30.7400, 76.7853, 2500, 1),
  ('Chandigarh', 'Sector 22', 30.7333, 76.7892, 2500, 2),
  ('Chandigarh', 'Sector 35', 30.7248, 76.7831, 3000, 3),
  ('Chandigarh', 'Industrial Area', 30.7047, 76.8003, 3500, 4),
  ('Chandigarh', 'Panchkula', 30.6942, 76.8606, 4000, 5),
  ('Chandigarh', 'Mohali', 30.7046, 76.7179, 4000, 6),
  ('Chandigarh', 'Zirakpur', 30.6475, 76.8177, 4000, 7),
  ('Chandigarh', 'Sector 43', 30.7080, 76.7963, 3000, 8)
ON CONFLICT DO NOTHING;

-- GURGAON
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Gurgaon', 'DLF Phase 1', 28.4952, 77.0862, 3500, 1),
  ('Gurgaon', 'Sector 14', 28.4682, 77.0316, 3000, 2),
  ('Gurgaon', 'MG Road', 28.4775, 77.0611, 3000, 3),
  ('Gurgaon', 'Golf Course Road', 28.4594, 77.1022, 4000, 4),
  ('Gurgaon', 'Sohna Road', 28.4209, 77.0527, 4000, 5),
  ('Gurgaon', 'Cyber City', 28.4950, 77.0906, 3000, 6),
  ('Gurgaon', 'Palam Vihar', 28.5107, 76.9985, 3500, 7),
  ('Gurgaon', 'Sector 57', 28.4200, 77.0747, 4000, 8)
ON CONFLICT DO NOTHING;

-- NOIDA
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Noida', 'Sector 18', 28.5697, 77.3216, 3500, 1),
  ('Noida', 'Sector 62', 28.6270, 77.3729, 4000, 2),
  ('Noida', 'Sector 37', 28.5480, 77.3397, 3500, 3),
  ('Noida', 'Sector 63', 28.6278, 77.3831, 4000, 4),
  ('Noida', 'Sector 15', 28.5854, 77.3094, 3500, 5),
  ('Noida', 'Sector 16', 28.5819, 77.3294, 3000, 6),
  ('Noida', 'Sector 50', 28.5830, 77.3610, 3500, 7),
  ('Noida', 'Greater Noida', 28.4744, 77.5040, 6000, 8)
ON CONFLICT DO NOTHING;

-- GHAZIABAD
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Ghaziabad', 'Indirapuram', 28.6469, 77.3618, 4000, 1),
  ('Ghaziabad', 'Vaishali', 28.6455, 77.3304, 3500, 2),
  ('Ghaziabad', 'Kaushambi', 28.6371, 77.3161, 3500, 3),
  ('Ghaziabad', 'Raj Nagar', 28.6714, 77.4271, 4000, 4),
  ('Ghaziabad', 'Mohan Nagar', 28.6929, 77.4338, 4000, 5),
  ('Ghaziabad', 'Shastri Nagar', 28.6763, 77.4219, 3500, 6)
ON CONFLICT DO NOTHING;

-- FARIDABAD
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Faridabad', 'NIT', 28.3986, 77.3159, 4000, 1),
  ('Faridabad', 'Sector 20', 28.4116, 77.3097, 3500, 2),
  ('Faridabad', 'Sector 12', 28.4332, 77.3164, 3500, 3),
  ('Faridabad', 'Old Faridabad', 28.4089, 77.3178, 4000, 4),
  ('Faridabad', 'Tigaon Road', 28.3648, 77.3402, 4000, 5),
  ('Faridabad', 'Ballabhgarh', 28.3405, 77.3235, 4000, 6)
ON CONFLICT DO NOTHING;

-- VISHAKHAPATNAM
INSERT INTO city_districts (city, district_name, lat, lng, search_radius, display_order) VALUES
  ('Vishakhapatnam', 'MVP Colony', 17.7231, 83.3012, 4000, 1),
  ('Vishakhapatnam', 'Dwaraka Nagar', 17.7272, 83.3146, 3500, 2),
  ('Vishakhapatnam', 'Madhurawada', 17.7855, 83.3779, 4000, 3),
  ('Vishakhapatnam', 'Gajuwaka', 17.6820, 83.2085, 4000, 4),
  ('Vishakhapatnam', 'Rushikonda', 17.7612, 83.3797, 3500, 5),
  ('Vishakhapatnam', 'Seethammadhara', 17.7284, 83.3285, 3000, 6),
  ('Vishakhapatnam', 'Steel Plant Area', 17.6948, 83.2201, 4000, 7),
  ('Vishakhapatnam', 'Ukkunagaram', 17.7010, 83.2380, 3500, 8)
ON CONFLICT DO NOTHING;
