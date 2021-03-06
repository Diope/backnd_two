import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  refreshTokenRevoke: Scalars['String'];
  login: LoginResponse;
  register: Scalars['Boolean'];
};


export type MutationRefreshTokenRevokeArgs = {
  userId: Scalars['Int'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  authTest: Scalars['String'];
  users: Array<User>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  username: Scalars['String'];
  email: Scalars['String'];
};

export type HelloTestQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloTestQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'hello'>
);


export const HelloTestDocument = gql`
    query HelloTest {
  hello
}
    `;

/**
 * __useHelloTestQuery__
 *
 * To run a query within a React component, call `useHelloTestQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelloTestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloTestQuery({
 *   variables: {
 *   },
 * });
 */
export function useHelloTestQuery(baseOptions?: Apollo.QueryHookOptions<HelloTestQuery, HelloTestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelloTestQuery, HelloTestQueryVariables>(HelloTestDocument, options);
      }
export function useHelloTestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelloTestQuery, HelloTestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelloTestQuery, HelloTestQueryVariables>(HelloTestDocument, options);
        }
export type HelloTestQueryHookResult = ReturnType<typeof useHelloTestQuery>;
export type HelloTestLazyQueryHookResult = ReturnType<typeof useHelloTestLazyQuery>;
export type HelloTestQueryResult = Apollo.QueryResult<HelloTestQuery, HelloTestQueryVariables>;