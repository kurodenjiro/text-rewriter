const Rating = `
type Rating {
    languageCombinationId: String
    rating: Int
    wordCount: Int
}
extend type Query {
    Ratings: [Rating]  
}
extend type Mutation {
    rateRewrite (rating: Int!, 
        language: String!, 
        processingLanguages: [String!]!, 
        translator: String, 
        wordCount: Int): Rating!
}`

export default () => [Rating]
