import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo';
require('dotenv').config()

const ENV_FILE = {
    appPort: process.env.APP_PORT,
    apiPort: process.env.API_PORT
}
console.log(ENV_FILE)

const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:3334/graphql' }),
    cache: new InMemoryCache()
})
ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
