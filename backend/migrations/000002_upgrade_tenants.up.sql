
-- Upgrade the existing tenants table to the Apex structure.

-- 1. Update existing column definitions.
ALTER TABLE public.tenants
    ALTER COLUMN id SET DEFAULT gen_random_uuid(),
    ALTER COLUMN name TYPE VARCHAR(150),
    ALTER COLUMN created_at DROP DEFAULT;

ALTER TABLE public.tenants
    ALTER COLUMN created_at TYPE TIMESTAMPTZ
    USING created_at AT TIME ZONE 'Africa/Johannesburg';

ALTER TABLE public.tenants
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

-- 2. Add the missing tenant registry columns.
ALTER TABLE public.tenants
    ADD COLUMN slug VARCHAR(63) NOT NULL,
    ADD COLUMN schema_name VARCHAR(63) NOT NULL,
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'provisioning',
    ADD COLUMN settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 3. Add uniqueness and validation constraints.
ALTER TABLE public.tenants
    ADD CONSTRAINT tenants_slug_unique UNIQUE (slug),
    ADD CONSTRAINT tenants_schema_name_unique UNIQUE (schema_name),
    ADD CONSTRAINT tenants_slug_format
        CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    ADD CONSTRAINT tenants_schema_format
        CHECK (schema_name ~ '^tenant_[a-f0-9]{32}$'),
    ADD CONSTRAINT tenants_status_valid
        CHECK (status IN ('provisioning', 'active', 'suspended'));
