require('dotenv').config({path: '../.env'})

const ENV_FILE = {
    apiPort: process.env.API_PORT,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,
    graphiqlOn: process.env.GRAPHIQL_ON
}

export default ENV_FILE