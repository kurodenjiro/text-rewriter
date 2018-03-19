const Rating = `
type Rating {
    language: String,
    processingLanguages: [String]
    rating: Int
}
type Query {
    Ratings: [Rating]  
}
type Mutation {
    rateRewrite (rating: Int!, language: String!, processingLanguages: [String!]!): Rating!
}`

export default () => [Rating]
