import gql from "graphql-tag";

export const REWRITE_MUTATION = gql`
mutation RewriteMutation($text: String!, $language: String!, $processingLanguages: [String], $autocorrect: Boolean, $thesaurus: Boolean, $translator: String) {
    rewrite(text: $text, language: $language, processingLanguages: $processingLanguages, autocorrect: $autocorrect, thesaurus: $thesaurus, translator: $translator) {
        rewrite
}}`
export const CREATE_RATING_MUTATION = gql`
mutation rateRewrite(
    $rating: Int, 
    $language: String!, 
    $processingLanguages: [String], 
    $translator: String, 
    $wordCount: Int){
    rateRewrite(
        rating: $rating, 
        language: $language, 
        processingLanguages: $processingLanguages,
        translator: $translator, 
        wordCount: $wordCount) {
            id languageCombinationId rating wordCount
}}`
