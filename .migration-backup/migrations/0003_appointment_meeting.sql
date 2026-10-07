-- Selected conversation slot and post-payment meeting association.
-- Do not store Zoom host credentials, medical records, or card data.

ALTER TABLE applications ADD COLUMN appointment_time TEXT;
ALTER TABLE applications ADD COLUMN appointment_timezone TEXT;
ALTER TABLE applications ADD COLUMN meeting_provider TEXT;
ALTER TABLE applications ADD COLUMN meeting_id TEXT;
ALTER TABLE applications ADD COLUMN meeting_join_url TEXT;
ALTER TABLE applications ADD COLUMN meeting_starts_at TEXT;
ALTER TABLE applications ADD COLUMN meeting_timezone TEXT;
ALTER TABLE applications ADD COLUMN meeting_status TEXT;
ALTER TABLE applications ADD COLUMN notification_status TEXT;
