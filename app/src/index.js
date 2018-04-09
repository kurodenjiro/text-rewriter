import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo';
import { Provider } from "./Context"
import { withClientState } from 'apollo-link-state'
import { ApolloLink } from 'apollo-link'

const API_URL = process.env.API_URL
const cache = new InMemoryCache()
const defaultState = { }

const stateLink = withClientState({
    cache,
    defaults: defaultState,
    resolvers: { Mutation: { } }
})

const client = new ApolloClient({
    link: ApolloLink.from([
        stateLink,
        new HttpLink({ uri: API_URL })
    ]),
    cache
})
ReactDOM.render(
    <BrowserRouter>
        <Provider>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </Provider>
    </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
