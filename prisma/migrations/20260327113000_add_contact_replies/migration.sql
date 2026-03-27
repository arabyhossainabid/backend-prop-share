ALTER TABLE "contacts"
ADD COLUMN IF NOT EXISTS "userId" TEXT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'contacts_userId_fkey'
    ) THEN
        ALTER TABLE "contacts"
        ADD CONSTRAINT "contacts_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "users"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS "contacts_userId_idx" ON "contacts"("userId");

CREATE TABLE IF NOT EXISTS "contact_replies" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderRole" "Role" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_replies_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'contact_replies_contactId_fkey'
    ) THEN
        ALTER TABLE "contact_replies"
        ADD CONSTRAINT "contact_replies_contactId_fkey"
        FOREIGN KEY ("contactId") REFERENCES "contacts"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'contact_replies_senderId_fkey'
    ) THEN
        ALTER TABLE "contact_replies"
        ADD CONSTRAINT "contact_replies_senderId_fkey"
        FOREIGN KEY ("senderId") REFERENCES "users"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS "contact_replies_contactId_createdAt_idx"
ON "contact_replies"("contactId", "createdAt");

CREATE INDEX IF NOT EXISTS "contact_replies_senderId_idx"
ON "contact_replies"("senderId");
