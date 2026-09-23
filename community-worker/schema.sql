-- No IP address, cookie ID, browser fingerprint, referrer or user-agent columns.
CREATE TABLE IF NOT EXISTS page_views (
 day TEXT NOT NULL, page TEXT NOT NULL, country TEXT NOT NULL,
 region TEXT NOT NULL, city TEXT NOT NULL, views INTEGER NOT NULL DEFAULT 1,
 PRIMARY KEY(day,page,country,region,city)
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS comments (
 seq INTEGER PRIMARY KEY AUTOINCREMENT,
 id TEXT NOT NULL UNIQUE, page TEXT NOT NULL, name TEXT NOT NULL,
 location TEXT NOT NULL, purpose TEXT NOT NULL, message TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved')),
 created INTEGER NOT NULL, consent_version TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS comment_public ON comments(status,page,seq);
CREATE INDEX IF NOT EXISTS comment_queue ON comments(status,seq);
CREATE INDEX IF NOT EXISTS comment_expiry ON comments(created);
CREATE TABLE IF NOT EXISTS budgets (
 day TEXT NOT NULL, kind TEXT NOT NULL, n INTEGER NOT NULL,
 PRIMARY KEY(day,kind)
) WITHOUT ROWID;
