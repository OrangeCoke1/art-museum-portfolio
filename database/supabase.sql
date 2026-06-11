-- Gallery Walk — Supabase / PostgreSQL
-- 在 Supabase Dashboard → SQL Editor 中粘贴并运行

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source VARCHAR(100) NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions (status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions (created_at);

CREATE OR REPLACE FUNCTION subscriptions_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION subscriptions_set_updated_at();

INSERT INTO subscriptions (email, source)
VALUES ('test@example.com', 'website')
ON CONFLICT (email) DO NOTHING;
