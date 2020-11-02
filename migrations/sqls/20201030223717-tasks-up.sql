CREATE TYPE task_status AS ENUM ('NEW', 'COMPLETED');

CREATE TABLE tasks
(
    id            SERIAL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    status task_status,
    due_date     TIMESTAMPTZ,
    user_id       INTEGER NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT author FOREIGN KEY ("user_id") REFERENCES users (id) ON DELETE CASCADE
);
