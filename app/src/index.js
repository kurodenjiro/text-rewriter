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
}

const stateLink = withClientState({
    cache,
    defaults: defaultState,
    resolvers: {
        Mutation: {
            rateRewrite: (_, { rating, language, processingLanguages, translator, thesaurus, autocorrect, wordCount}, { cache }) => {
                const query = gql`
query GetLanguageCombinations{ LanguageCombinations @client { 
    id processingLanguages language translator ratingCount avgRating
}}`
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
                cache.writeData({ query, data })
                console.log('prev', previousState, data, rating, language, processingLanguages, translator, thesaurus, autocorrect, wordCount)
            },
            rewrite: (_, { text, language, processingLanguages }, { cache }) => {
                console.log('rewrite...',text, language, processingLanguages)
                return { rewrite: 'ok'}
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
