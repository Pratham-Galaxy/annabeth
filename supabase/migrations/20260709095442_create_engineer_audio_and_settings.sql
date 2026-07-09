/*
# Create engineer_audio table, app_settings table, and audio storage bucket

1. New Tables
- `engineer_audio`
  - `id` (uuid, primary key)
  - `trigger` (text, the quick-message text that triggers this clip, e.g. "Box box box!")
  - `label` (text, display name for the clip, e.g. "Box Box Box")
  - `storage_path` (text, path in the radio-clips bucket)
  - `created_at` (timestamptz, default now())
- `app_settings`
  - `id` (int, primary key, always 1 — singleton row)
  - `complaint_email` (text, where complaint notifications are sent)
  - `updated_at` (timestamptz, default now())

2. Storage
- Create `radio-clips` bucket (public) for engineer voice recordings.
- Policies allow anon read and write so the frontend can upload/listen without auth.

3. Security
- RLS enabled on both tables.
- `engineer_audio`: anon + authenticated full CRUD (single-tenant gift site, no sign-in).
- `app_settings`: anon + authenticated full CRUD.
- Bucket policies: public read, anon upload.

4. Notes
- Single-tenant, no auth — the frontend uses the anon key.
- The engineer (gift-giver) uploads voice clips via the Team Radio admin panel.
- When the driver sends a matching quick-message, the clip plays as the engineer's voice.
- app_settings.complaint_email stores the recipient address for complaint notifications.
*/

CREATE TABLE IF NOT EXISTS engineer_audio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger text NOT NULL,
  label text NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_settings (
  id int PRIMARY KEY DEFAULT 1,
  complaint_email text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_row CHECK (id = 1)
);

INSERT INTO app_settings (id) VALUES (1)
  ON CONFLICT (id) DO NOTHING;

ALTER TABLE engineer_audio ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_engineer_audio" ON engineer_audio;
CREATE POLICY "anon_select_engineer_audio" ON engineer_audio FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_engineer_audio" ON engineer_audio;
CREATE POLICY "anon_insert_engineer_audio" ON engineer_audio FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_engineer_audio" ON engineer_audio;
CREATE POLICY "anon_update_engineer_audio" ON engineer_audio FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_engineer_audio" ON engineer_audio;
CREATE POLICY "anon_delete_engineer_audio" ON engineer_audio FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_app_settings" ON app_settings;
CREATE POLICY "anon_select_app_settings" ON app_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_app_settings" ON app_settings;
CREATE POLICY "anon_update_app_settings" ON app_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS engineer_audio_trigger_idx ON engineer_audio (trigger);

-- Create the radio-clips storage bucket
INSERT INTO storage.buckets (id, name, public)
  VALUES ('radio-clips', 'radio-clips', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies: allow anon to read and upload clips
DROP POLICY IF EXISTS "anon_read_radio_clips" ON storage.objects;
CREATE POLICY "anon_read_radio_clips" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'radio-clips');

DROP POLICY IF EXISTS "anon_upload_radio_clips" ON storage.objects;
CREATE POLICY "anon_upload_radio_clips" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'radio-clips');

DROP POLICY IF EXISTS "anon_delete_radio_clips" ON storage.objects;
CREATE POLICY "anon_delete_radio_clips" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'radio-clips');
