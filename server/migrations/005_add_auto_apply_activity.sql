CREATE TABLE IF NOT EXISTS auto_apply_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    queue_id UUID REFERENCES auto_apply_queue(id) ON DELETE SET NULL,
    event TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_user_id ON auto_apply_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON auto_apply_activity(created_at DESC);
