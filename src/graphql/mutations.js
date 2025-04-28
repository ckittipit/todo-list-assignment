import { gql } from '@apollo/client'

export const SIGNUP_USER = gql`
    mutation SignupUser($email: String!, $password: String!, $name: String!) {
        insert_users_one(
            object: { email: $email, password: $password, name: $name }
        ) {
            id
            email
            name
        }
    }
`

export const LOGIN_USER = gql`
    query LoginUser($email: String!, $password: String!) {
        users(where: { email: { _eq: $email }, password: { _eq: $password } }) {
            id
            email
            name
        }
    }
`

export const ADD_TODO = gql`
    mutation AddTodo(
        $title: String!
        $description: String!
        $priority: Int!
        $is_completed: Boolean!
        $user_id: Int!
    ) {
        insert_todos_one(
            object: {
                title: $title
                description: $description
                priority: $priority
                is_completed: $is_completed
                user_id: $user_id
            }
        ) {
            id
            title
            description
            priority
            is_completed
        }
    }
`

export const UPDATE_TODO = gql`
    mutation UpdateTodo(
        $id: Int!
        $title: String
        $description: String
        $priority: Int
        $is_completed: Boolean
    ) {
        update_todos_by_pk(
            pk_columns: { id: $id }
            _set: {
                title: $title
                description: $description
                priority: $priority
                is_completed: $is_completed
            }
        ) {
            id
            title
            description
            priority
            is_completed
        }
    }
`

export const DELETE_TODO = gql`
    mutation DeleteTodo($id: Int!) {
        delete_todos_by_pk(id: $id) {
            id
        }
    }
`

export const GET_TODOS = gql`
    query GetTodos($user_id: Int!) {
        todos(where: { user_id: { _eq: $user_id } }) {
            id
            title
            description
            priority
            is_completed
        }
    }
`
