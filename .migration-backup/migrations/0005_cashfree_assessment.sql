-- Phase 1 additive migration. Historical application/payment rows untouched.
ALTER TABLE assessment_orders ADD COLUMN payment_provider TEXT NOT NULL DEFAULT 'dodo'
  CHECK (payment_provider IN ('dodo', 'cashfree'));

CREATE TABLE assessment_payment_attempts (
  payment_provider TEXT NOT NULL CHECK (payment_provider = 'cashfree'),
  provider_payment_id TEXT NOT NULL,
  assessment_order_id TEXT NOT NULL REFERENCES assessment_orders(id),
  status TEXT NOT NULL,
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  captured INTEGER NOT NULL,
  adjusted INTEGER NOT NULL,
  occurred_at TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (payment_provider, provider_payment_id)
);
CREATE INDEX idx_assessment_attempt_order ON assessment_payment_attempts(assessment_order_id);
