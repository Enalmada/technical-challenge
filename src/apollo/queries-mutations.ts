import gql from "graphql-tag";

export const USERS = gql`
    query Users {
        users {
            id
            email
        }
    }
`;

export const EMAIL_TEMPLATE = gql`
    query EmailTemplate($template: String!) {
        emailTemplate(template: $template) {
            html
        }
    }
`;

// TODO: turn tasks into fragment
export const TASKS = gql`
    query Tasks {
        tasks {
            id
            title
            description
            dueDate
            status
            createdAt
            updatedAt
        }
    }
`;

export const UPSERT_TASK = gql`
    mutation UpsertTask($input: TaskInput!) {
        upsertTask(input: $input) {
            id
            title
            description
            dueDate
            status
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_TASK = gql`
    mutation DeleteTask($id: Int!) {
        deleteTask(id: $id) {
            id
            title
            description
            dueDate
            status
            createdAt
            updatedAt
        }
    }
`;
