-- Durable operational store for DCredit applications.
-- Google Sheets is the staff CRM replica. Do not store clinical records here.

CREATE TABLE IF NOT EXISTS identities (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  google_sub TEXT,
  stripe_customer_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  identity_id TEXT NOT NULL,
  application_id TEXT NOT NULL UNIQUE,
  conversation_verification_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  us_state TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  procedure_category TEXT NOT NULL DEFAULT '',
  procedure TEXT NOT NULL DEFAULT '',
  insurance_status TEXT NOT NULL DEFAULT '',
  estimated_us_oop TEXT NOT NULL DEFAULT '',
  preferred_timeline TEXT NOT NULL DEFAULT '',
  preferred_consultation_date TEXT NOT NULL DEFAULT '',
  payment_status TEXT NOT NULL,
  payment_reference TEXT NOT NULL DEFAULT '',
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  sku TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  application_status TEXT NOT NULL,
  assigned_coordinator TEXT NOT NULL DEFAULT '',
  last_contact_date TEXT NOT NULL DEFAULT '',
  next_followup_date TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'dcredit.in',
  notes TEXT NOT NULL DEFAULT '',
  sheets_sync_status TEXT NOT NULL DEFAULT 'pending',
  sheets_sync_error TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (identity_id) REFERENCES identities(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  stripe_payment_intent TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  application_id TEXT,
  identity_id TEXT,
  event TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS call_verifications (
  id TEXT PRIMARY KEY,
  call_id TEXT NOT NULL UNIQUE,
  application_id TEXT,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS counters (
  name TEXT PRIMARY KEY,
  value INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_applications_identity ON applications(identity_id);
CREATE INDEX IF NOT EXISTS idx_applications_stripe ON applications(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_audit_application ON audit_events(application_id);
