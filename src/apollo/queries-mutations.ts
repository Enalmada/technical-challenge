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

export const TASK_PARTS = gql`
    fragment TaskParts on Task {
        id
        title
        description
        dueDate
        status
        createdAt
        updatedAt
    }
`;

export const TASKS = gql`
    query Tasks {
        tasks {
            ...TaskParts
        }
    }
    ${TASK_PARTS}
`;

export const UPSERT_TASK = gql`
    mutation UpsertTask($input: TaskInput!) {
        upsertTask(input: $input) {
            ...TaskParts
        }
    }
    ${TASK_PARTS}
`;

export const DELETE_TASK = gql`
    mutation DeleteTask($id: Int!) {
        deleteTask(id: $id) {
            ...TaskParts
        }
    }
    ${TASK_PARTS}
`;
