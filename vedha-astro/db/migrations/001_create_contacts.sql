-- Migration: 001_create_contacts
-- Contact / enquiry leads from website forms (contact, service enquiry, LP, cost estimate, newsletter).

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT '',
  base_package TEXT NOT NULL DEFAULT '',
  addons TEXT NOT NULL DEFAULT '',
  total_aed INTEGER,
  notes TEXT NOT NULL DEFAULT '',
  delivery_estimate TEXT NOT NULL DEFAULT '',
  delivery_preference TEXT NOT NULL DEFAULT '',
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotent column adds (safe if table already existed with fewer columns)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS email TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS service TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS budget TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS base_package TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS addons TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS total_aed INTEGER;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS delivery_estimate TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS delivery_preference TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS payload JSONB NOT NULL DEFAULT '{}';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS contacts_type_idx ON contacts (type);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts (email);
CREATE INDEX IF NOT EXISTS contacts_phone_idx ON contacts (phone);

-- Copy any rows from the temporary form_submissions table (if it exists)
DO $$
BEGIN
  IF to_regclass('public.form_submissions') IS NOT NULL THEN
    INSERT INTO contacts (
      id, type, name, email, phone, service, category, description, budget,
      base_package, addons, total_aed, notes, delivery_estimate, delivery_preference,
      payload, created_at
    )
    SELECT
      id, type, name, email, phone, service, category, description, budget,
      base_package, addons, total_aed, notes, delivery_estimate, delivery_preference,
      COALESCE(payload, '{}'::jsonb), created_at
    FROM form_submissions fs
    WHERE NOT EXISTS (SELECT 1 FROM contacts c WHERE c.id = fs.id);

    PERFORM setval(
      pg_get_serial_sequence('contacts', 'id'),
      GREATEST(
        (SELECT COALESCE(MAX(id), 1) FROM contacts),
        1
      )
    );
  END IF;
END $$;
