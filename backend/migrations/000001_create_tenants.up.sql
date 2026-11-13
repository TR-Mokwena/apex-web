CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,

    slug VARCHAR(63) NOT NULL UNIQUE,

    schema_name VARCHAR(63) NOT NULL UNIQUE,

    status VARCHAR(20) NOT NULL DEFAULT 'provisioning',

    settings JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT tenants_slug_format
        CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

    CONSTRAINT tenants_schema_format
        CHECK (schema_name ~ '^tenant_[a-f0-9]{32}$'),

    CONSTRAINT tenants_status_valid
        CHECK (status IN ('provisioning', 'active', 'suspended'))
);
