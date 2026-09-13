-- Provider-neutral payment columns. Legacy stripe_* columns remain unused.
-- Do not store card numbers, CVV, or bank credentials.

ALTER TABLE applications ADD COLUMN payment_provider TEXT;
ALTER TABLE applications ADD COLUMN provider_checkout_id TEXT;
ALTER TABLE applications ADD COLUMN provider_payment_id TEXT;

ALTER TABLE payments ADD COLUMN payment_provider TEXT;
ALTER TABLE payments ADD COLUMN provider_checkout_id TEXT;
ALTER TABLE payments ADD COLUMN provider_payment_id TEXT;

CREATE INDEX IF NOT EXISTS idx_applications_provider_checkout ON applications(provider_checkout_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_payment_id
  ON payments(provider_payment_id)
  WHERE provider_payment_id IS NOT NULL AND provider_payment_id != '';
