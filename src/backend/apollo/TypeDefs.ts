import { gql } from "apollo-server-micro";

/*
    Consider using graphql-tools to convert this into a schema.graphql file
    https://www.graphql-tools.com/docs/migration-from-import/
 */
const TypeDefs = gql`
    scalar UTCDateTime

    type User {
        id: Int!
        email: String
    }

    enum TaskStatus {
        NEW
        COMPLETED
    }

    type Task {
        id: Int!
        title: String!
        description: String
        dueDate: UTCDateTime
        status: TaskStatus
        createdAt: UTCDateTime!
        updatedAt: UTCDateTime
    }

    type Template {
        html: String
    }

    input TaskInput {
        id: Int
        title: String!
        description: String
        dueDate: UTCDateTime
        status: TaskStatus!
    }

    type Query {
        tasks: [Task!]!
        emailTemplate(template: String!): Template
    }

    type Mutation {
        upsertTask(input: TaskInput!): Task
        deleteTask(id: Int!): Task
    }
`;

export { TypeDefs as default };
