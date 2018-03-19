import { makeExecutableSchema } from 'graphql-tools';
import Rating from './models/Rating';
import Rewrite from './models/Rewrite';
import resolvers from './Resolvers';
//TODO SWITCH OUT CONTRACTIONS

export default makeExecutableSchema({
    typeDefs: [Rating, Rewrite],
    resolvers,
    //logger: { log: e => console.log(e) },
});
