import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const client = new ApolloClient({
    link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_HASURA_URL,
        headers: {
            'x-hasura-admin-secret':
                'lubbncy0Hol2XSzjM5jViLM1WnaBCiFCCKd9iwyhHEZmfNoh1aZ3KfodFMaAt1jF',
            'x-hasura-role':
                typeof window !== 'undefined' && localStorage.getItem('user')
                    ? 'user'
                    : 'anonymous',
            'x-hasura-user-id':
                typeof window !== 'undefined'
                    ? JSON.parse(localStorage.getItem('user') || '{}').id || ''
                    : '',
        },
    }),
    cache: new InMemoryCache(),
})

export default client
