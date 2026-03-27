-- Add phone column if it does not exist
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- Add unique index for phone when not already present
CREATE UNIQUE INDEX IF NOT EXISTS "users_phone_key"
ON "users"("phone");
