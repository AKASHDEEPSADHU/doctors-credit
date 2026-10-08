-- Additive Phase 1 only. No updates to historical applications/payments.
ALTER TABLE identities ADD COLUMN patient_type TEXT
  CHECK (patient_type IS NULL OR patient_type IN ('DOMESTIC', 'INTERNATIONAL'));
ALTER TABLE identities ADD COLUMN updated_at TEXT;

CREATE TABLE assessment_orders (
  id TEXT PRIMARY KEY,
  identity_id TEXT NOT NULL REFERENCES identities(id),
  patient_type TEXT NOT NULL CHECK (patient_type IN ('DOMESTIC', 'INTERNATIONAL')),
  service TEXT NOT NULL CHECK (service = 'initial_patient_assessment'),
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REVIEW_REQUIRED')),
  provider_environment TEXT NOT NULL CHECK (provider_environment IN ('test_mode', 'live_mode')),
  provider_checkout_id TEXT,
  provider_checkout_url TEXT,
  provider_payment_id TEXT,
  confirmed_amount_minor INTEGER,
  confirmed_currency TEXT,
  consent_version TEXT NOT NULL,
  consent_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  confirmed_at TEXT,
  review_reason TEXT,
  CHECK ((patient_type = 'DOMESTIC' AND amount_minor = 99900 AND currency = 'INR')
    OR (patient_type = 'INTERNATIONAL' AND amount_minor = 1500 AND currency = 'USD'))
);
CREATE INDEX idx_assessment_identity ON assessment_orders(identity_id, created_at);
CREATE UNIQUE INDEX idx_assessment_active ON assessment_orders(identity_id)
  WHERE status IN ('PENDING', 'PAID');
CREATE UNIQUE INDEX idx_assessment_checkout ON assessment_orders(provider_checkout_id)
  WHERE provider_checkout_id IS NOT NULL;
CREATE UNIQUE INDEX idx_assessment_payment ON assessment_orders(provider_payment_id)
  WHERE provider_payment_id IS NOT NULL;
-- Fail safely if historical account duplication exists; never merge accounts.
CREATE UNIQUE INDEX idx_identity_google_subject ON identities(google_sub)
  WHERE google_sub IS NOT NULL AND google_sub <> '';
CREATE TRIGGER assessment_patient_type_guard BEFORE INSERT ON assessment_orders
WHEN NOT EXISTS (SELECT 1 FROM identities WHERE id = NEW.identity_id AND patient_type = NEW.patient_type)
  OR EXISTS (SELECT 1 FROM assessment_orders WHERE identity_id = NEW.identity_id AND status = 'REVIEW_REQUIRED')
BEGIN
  SELECT RAISE(ABORT, 'Patient type changed or payment review required');
END;
