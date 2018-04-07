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
import gql from "graphql-tag";

const API_URL = process.env.API_URL
const cache = new InMemoryCache()
const defaultState = {
    // only need if waiting before mutation
    // LanguageCombinations: [{//if want query name, put query: { LanguageCombinations: [...] }
    //     __typename: 'LanguageCombination',
    //     id: '2',
    //     language: 'en',
    //     translator: 'google',
    //     processingLanguages: ['es'],
    //     avgRating: '3.1',
    //     ratingCount: 3
    // }]
    rewrite: {
        rewrit2: '2',
        __typename: 'Rewrite'
    }
}

const stateLink = withClientState({
    cache,
    defaults: defaultState,
    resolvers: {
        Mutation: {
            rateRewrite: (_, { rating, language, processingLanguages, translator, thesaurus, autocorrect, wordCount}, { cache }) => {//TODO NONE OF THIS CODE IS USED, ONLY FOR EXAMPLE
                const query = gql`
query GetLanguageCombinations{ LanguageCombinations @client { 
    id processingLanguages language translator ratingCount avgRating
}}` //todo this is the real query
                const previousState = cache.readQuery({ query })
                const data = {
                    ...previousState,//everything not from this query
                    LanguageCombinations: [//this query
                        ...previousState.LanguageCombinations,//existing array
                        {//new item
                            __typename: 'LanguageCombination',
                            id: '4',
                            rating: rating,
                            language: language,
                            processingLanguages: processingLanguages,
                            translator: translator,
                            thesaurus: thesaurus,
                            autocorrect: autocorrect,
                            wordCount: wordCount,
                            avgRating: '2.0',
                            ratingCount: 9
                        }
                    ]
                }
                //todo call a query refetch
                cache.writeData({ query, data })
            },
            rewrite: (_, { text, language, processingLanguages }, { cache }) => {
                console.log('rewrite...',text, language, processingLanguages)
                return { rewrite: 'ok'}
                //todo call actual query
            }
        }
    }
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
