import { find, filter } from 'lodash'
import db from './models/db'
const translate = require('google-translate-api')
//const thesaurus = require('thesaurus')
//https://www.npmjs.com/package/thesaurus
import rewriteText from './utils/rewriteText.utils'

export default {
    Query: {
        LanguageCombinations: () => {
            return db.models.languageCombination.findAll({
                group: ['languageCombination.id'],
                //add attributes of languageCombination
                attributes: ['id', 'language', 'processingLanguages', 'translator',
                    [db.fn('count', db.col('ratings.rating')), 'ratingCount'],
                    [db.fn('avg', db.col('ratings.rating')), 'avgRating']],
                include: [{attributes:[], as: 'ratings', model: db.models.rating}] //TODO ratings returning null
                // WORKING HERE: https://github.com/sequelize/sequelize/issues/3596
            }).then(languageCombinations => {
                //todo filterby avg rating count and count number
                return languageCombinations.map(languageCombination=>{
                    const avgRating = (Math.round(languageCombination.dataValues.avgRating * 10)/10).toString()
                    return Object.assign({},
                        {
                            id: languageCombination.id,
                            processingLanguages: languageCombination.processingLanguages,
                            language: languageCombination.language,
                            translator: languageCombination.translator,
                            avgRating: avgRating,
                            ratingCount: languageCombination.dataValues.ratingCount,
                            // avgRating: 3,
                            //  ratings: []//languageCombination.ratings.map(rating=>{
                            //     return Object.assign({},
                            //         {
                            //             id: rating.id,
                            //             languageCombinationId: languageCombination.id,
                            //             rating: rating.rating,
                            //             wordCount: rating.wordCount
                            //         })
                            // })
                        })}
                    )
                })
        }
    },
    Mutation: {
        rewrite: (_, data)=>rewriteText(data),
        rateRewrite: async (_, data) => {
            console.log(data)
            return new Promise((resolve, reject) => {
                db.models.languageCombination.findOrCreate({
                    where: {
                        processingLanguages: JSON.stringify(data.processingLanguages),
                        language: data.language,
                        translator: data.translator
                    }
                }).spread((languageCombination, createdNewLanguageCombination) => {
                    console.log(languageCombination, createdNewLanguageCombination)
                    languageCombination.createRating({
                        rating: data.rating,
                        wordCount: data.wordCount
                    }).then(rating => {
                        resolve(Object.assign({},
                            {
                                id: rating.id,
                                languageCombinationId: languageCombination.id,
                                rating: rating.rating,
                                wordCount: rating.wordCount
                            }))
                    })
                })
            })
        }
    }
};

// graphql-example file wtweets, user, etc. https://github.com/marmelab/GraphQL-example/blob/master/server/src/schema.js

//doing joins sequelize mysql users... https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins/

//example schema https://github.com/apollographql/graphql-tools/blob/master/docs/source/generate-schema.md

// check the author: and post : which returns author or post, this is to get posts or authors from the linked ID

// huge ass graphql-tools testing file https://github.com/apollographql/graphql-tools/blob/master/src/test/testMocking.ts
