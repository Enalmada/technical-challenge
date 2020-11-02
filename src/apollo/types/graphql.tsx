import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** UTC DateTime custom scalar type */
  UTCDateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email?: Maybe<Scalars['String']>;
};

export enum TaskStatus {
  New = 'NEW',
  Completed = 'COMPLETED'
}

export type Task = {
  __typename?: 'Task';
  id: Scalars['Int'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['UTCDateTime']>;
  status?: Maybe<TaskStatus>;
  createdAt: Scalars['UTCDateTime'];
  updatedAt?: Maybe<Scalars['UTCDateTime']>;
};

export type Template = {
  __typename?: 'Template';
  html?: Maybe<Scalars['String']>;
};

export type TaskInput = {
  id?: Maybe<Scalars['Int']>;
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['UTCDateTime']>;
  status: TaskStatus;
};

export type Query = {
  __typename?: 'Query';
  users: Array<User>;
  tasks: Array<Task>;
  emailTemplate?: Maybe<Template>;
};


export type QueryEmailTemplateArgs = {
  template: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  upsertTask?: Maybe<Task>;
  deleteTask?: Maybe<Task>;
};


export type MutationUpsertTaskArgs = {
  input: TaskInput;
};


export type MutationDeleteTaskArgs = {
  id: Scalars['Int'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  )> }
);

export type EmailTemplateQueryVariables = Exact<{
  template: Scalars['String'];
}>;


export type EmailTemplateQuery = (
  { __typename?: 'Query' }
  & { emailTemplate?: Maybe<(
    { __typename?: 'Template' }
    & Pick<Template, 'html'>
  )> }
);

export type TasksQueryVariables = Exact<{ [key: string]: never; }>;


export type TasksQuery = (
  { __typename?: 'Query' }
  & { tasks: Array<(
    { __typename?: 'Task' }
    & Pick<Task, 'id' | 'title' | 'description' | 'dueDate' | 'status' | 'createdAt' | 'updatedAt'>
  )> }
);

export type UpsertTaskMutationVariables = Exact<{
  input: TaskInput;
}>;


export type UpsertTaskMutation = (
  { __typename?: 'Mutation' }
  & { upsertTask?: Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, 'id' | 'title' | 'description' | 'dueDate' | 'status' | 'createdAt' | 'updatedAt'>
  )> }
);

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & { deleteTask?: Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, 'id' | 'title' | 'description' | 'dueDate' | 'status' | 'createdAt' | 'updatedAt'>
  )> }
);


export const UsersDocument = gql`
    query Users {
  users {
    id
    email
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const EmailTemplateDocument = gql`
    query EmailTemplate($template: String!) {
  emailTemplate(template: $template) {
    html
  }
}
    `;

/**
 * __useEmailTemplateQuery__
 *
 * To run a query within a React component, call `useEmailTemplateQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmailTemplateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmailTemplateQuery({
 *   variables: {
 *      template: // value for 'template'
 *   },
 * });
 */
export function useEmailTemplateQuery(baseOptions?: Apollo.QueryHookOptions<EmailTemplateQuery, EmailTemplateQueryVariables>) {
        return Apollo.useQuery<EmailTemplateQuery, EmailTemplateQueryVariables>(EmailTemplateDocument, baseOptions);
      }
export function useEmailTemplateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EmailTemplateQuery, EmailTemplateQueryVariables>) {
          return Apollo.useLazyQuery<EmailTemplateQuery, EmailTemplateQueryVariables>(EmailTemplateDocument, baseOptions);
        }
export type EmailTemplateQueryHookResult = ReturnType<typeof useEmailTemplateQuery>;
export type EmailTemplateLazyQueryHookResult = ReturnType<typeof useEmailTemplateLazyQuery>;
export type EmailTemplateQueryResult = Apollo.QueryResult<EmailTemplateQuery, EmailTemplateQueryVariables>;
export const TasksDocument = gql`
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

/**
 * __useTasksQuery__
 *
 * To run a query within a React component, call `useTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTasksQuery({
 *   variables: {
 *   },
 * });
 */
export function useTasksQuery(baseOptions?: Apollo.QueryHookOptions<TasksQuery, TasksQueryVariables>) {
        return Apollo.useQuery<TasksQuery, TasksQueryVariables>(TasksDocument, baseOptions);
      }
export function useTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TasksQuery, TasksQueryVariables>) {
          return Apollo.useLazyQuery<TasksQuery, TasksQueryVariables>(TasksDocument, baseOptions);
        }
export type TasksQueryHookResult = ReturnType<typeof useTasksQuery>;
export type TasksLazyQueryHookResult = ReturnType<typeof useTasksLazyQuery>;
export type TasksQueryResult = Apollo.QueryResult<TasksQuery, TasksQueryVariables>;
export const UpsertTaskDocument = gql`
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
export type UpsertTaskMutationFn = Apollo.MutationFunction<UpsertTaskMutation, UpsertTaskMutationVariables>;

/**
 * __useUpsertTaskMutation__
 *
 * To run a mutation, you first call `useUpsertTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertTaskMutation, { data, loading, error }] = useUpsertTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpsertTaskMutation(baseOptions?: Apollo.MutationHookOptions<UpsertTaskMutation, UpsertTaskMutationVariables>) {
        return Apollo.useMutation<UpsertTaskMutation, UpsertTaskMutationVariables>(UpsertTaskDocument, baseOptions);
      }
export type UpsertTaskMutationHookResult = ReturnType<typeof useUpsertTaskMutation>;
export type UpsertTaskMutationResult = Apollo.MutationResult<UpsertTaskMutation>;
export type UpsertTaskMutationOptions = Apollo.BaseMutationOptions<UpsertTaskMutation, UpsertTaskMutationVariables>;
export const DeleteTaskDocument = gql`
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
export type DeleteTaskMutationFn = Apollo.MutationFunction<DeleteTaskMutation, DeleteTaskMutationVariables>;

/**
 * __useDeleteTaskMutation__
 *
 * To run a mutation, you first call `useDeleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskMutation, { data, loading, error }] = useDeleteTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTaskMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskMutation, DeleteTaskMutationVariables>) {
        return Apollo.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, baseOptions);
      }
export type DeleteTaskMutationHookResult = ReturnType<typeof useDeleteTaskMutation>;
export type DeleteTaskMutationResult = Apollo.MutationResult<DeleteTaskMutation>;
export type DeleteTaskMutationOptions = Apollo.BaseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>;