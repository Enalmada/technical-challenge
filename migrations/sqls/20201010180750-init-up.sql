CREATE TABLE users
(
    id             SERIAL,
    firebase_id    VARCHAR(255),
    name           VARCHAR(255),
    email          VARCHAR(255),
    image          VARCHAR(255),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
