import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import mysql from 'mysql'

import schema from './Schema';

const app = express();

app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(
    '/graphql',
    graphqlHTTP(request => ({
        schema: schema,
        graphiql: true,
    })),
);
app.listen(3001);
console.log('Running a GraphQL API server at http://localhost:3001/graphql');

// Exmaple from https://github.com/marmelab/GraphQL-example/tree/master/server/src
