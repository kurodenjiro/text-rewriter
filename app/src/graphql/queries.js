import gql from "graphql-tag";

//if add @client, it will look for info from client, not from actual query
export const LANGUAGE_COMBINATIONS_QUERY = gql`
query { LanguageCombinations { 
    id processingLanguages language translator ratingCount avgRating
}}`