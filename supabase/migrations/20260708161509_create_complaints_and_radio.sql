/*
# Create complaints and team_radio tables (single-tenant, no auth)

1. New Tables
- `complaints` — messages the Driver files against the Engineer via the Complaint Box.
  - `id` (uuid, primary key)
  - `driver_name` (text, who filed it — defaults to the Driver)
  - `complaint` (text, the complaint body, not null)
  - `verdict` (text, the random guilty verdict shown back)
  - `created_at` (timestamptz, default now())
- `team_radio` — short radio messages the Driver sends to the Engineer.
  - `id` (uuid, primary key)
  - `driver_name` (text, who sent it)
  - `message` (text, the radio message, not null)
  - `created_at` (timestamptz, default now())

2. Security
- Both tables are intentionally public/shared (single-tenant gift site, no sign-in).
- Enable RLS on both tables.
- Allow anon + authenticated full CRUD so the anon-key frontend can read and write.

3. Notes
- No user_id columns and no auth.users references — this is a single-recipient gift website.
- Complaint history and radio history persist across reloads for the Driver to revisit.
- Indices on created_at for chronological ordering.
*/

CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_name text NOT NULL DEFAULT 'Aastha',
  complaint text NOT NULL,
  verdict text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_radio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_name text NOT NULL DEFAULT 'Aastha',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_radio ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_complaints" ON complaints;
CREATE POLICY "anon_select_complaints" ON complaints FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_complaints" ON complaints;
CREATE POLICY "anon_insert_complaints" ON complaints FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_complaints" ON complaints;
CREATE POLICY "anon_update_complaints" ON complaints FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_complaints" ON complaints;
CREATE POLICY "anon_delete_complaints" ON complaints FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_radio" ON team_radio;
CREATE POLICY "anon_select_radio" ON team_radio FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_radio" ON team_radio;
CREATE POLICY "anon_insert_radio" ON team_radio FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_radio" ON team_radio;
CREATE POLICY "anon_update_radio" ON team_radio FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_radio" ON team_radio;
CREATE POLICY "anon_delete_radio" ON team_radio FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS complaints_created_at_idx ON complaints (created_at DESC);
CREATE INDEX IF NOT EXISTS team_radio_created_at_idx ON team_radio (created_at DESC);
