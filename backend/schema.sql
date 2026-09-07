CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admins_email ON admins(email);

-- Drop existing tables if needed (optional)
-- DROP TABLE IF EXISTS proposal_views;
-- DROP TABLE IF EXISTS proposals;
-- DROP TYPE IF EXISTS proposal_status;
-- DROP TYPE IF EXISTS proposal_type;

CREATE TYPE proposal_type AS ENUM ('profile_only', 'quotation_proposal');
CREATE TYPE proposal_status AS ENUM ('sent', 'viewed', 'accepted', 'renewal_due', 'renewed');

CREATE TABLE proposals (
    id BIGSERIAL PRIMARY KEY,
    type proposal_type NOT NULL,
    proposal_no VARCHAR(50),
    client_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    project_title VARCHAR(500),
    amount NUMERIC(10,2),
    currency VARCHAR(10),
    pdf_path VARCHAR(500),
    unique_token VARCHAR(255) NOT NULL UNIQUE,
    sent_at TIMESTAMPTZ,
    first_opened_at TIMESTAMPTZ,
    last_opened_at TIMESTAMPTZ,
    view_count INTEGER NOT NULL DEFAULT 0,
    renewal_date DATE,
    status proposal_status NOT NULL DEFAULT 'sent',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE proposal_views (
    id BIGSERIAL PRIMARY KEY,
    proposal_id BIGINT NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_unique_token ON proposals(unique_token);
CREATE INDEX idx_proposals_proposal_no ON proposals(proposal_no);
CREATE INDEX idx_proposal_views_proposal_id ON proposal_views(proposal_id);
