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

const API_URL = process.env.API_URL

const client = new ApolloClient({
    link: new HttpLink({ uri: API_URL }),
    cache: new InMemoryCache()
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
