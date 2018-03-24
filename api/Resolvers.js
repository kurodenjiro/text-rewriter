import { find, filter } from 'lodash'
//import ToDo from './models/db'
import db from './models/db'
const translate = require('google-translate-api')
//const thesaurus = require('thesaurus')
//https://www.npmjs.com/package/thesaurus

export default {
    Query: {
        LanguageCombinations: () => {
            return db.models.languageCombination.findAll({
                include: [{
                    model: db.models.rating,
                    as: 'ratings', //put here to specify, adds plural itself though
                    //todo have avgRating, see SO question
                    // attributes:  {include: ['rating',[db.fn('COUNT', 'ratings.rating'), 'RATING_COUNT']]},
                    // group: ['ratings.rating'],
                }],
            }).then(languageCombinations => {
                console.log(languageCombinations)
                return languageCombinations.map(languageCombination=>{
                    return Object.assign({},
                        {
                            id: languageCombination.id,
                            processingLanguages: languageCombination.processingLanguages,
                            language: languageCombination.language,
                            translator: languageCombination.translator,
                            ratingCount: languageCombination.ratings.length,
                            avgRating: 3,
                            ratings: languageCombination.ratings.map(rating=>{
                                return Object.assign({},
                                    {
                                        id: rating.id,
                                        languageCombinationId: languageCombination.id,
                                        rating: rating.rating,
                                        wordCount: rating.wordCount
                                    })
                            })
                        })}
                    )
                })
        }
    },
    Mutation: {
        //TODO SWITCH OUT CONTRACTIONS
        //TODO THESAURUS SHOULD BE ADDED AFTER REWRITE IF THERE ARE SIMILAR MATCHES OR WHAT NOT
        rewrite: async (_, data) => {
            const textToRewrite = data.text
            const baseLanguage = (data.language) ? data.language: 'en'
            const processingLanguages = (data.processingLanguages && data.processingLanguages.length > 0) ? data.processingLanguages : ['es']
            await processingLanguages.push('en')

            let processedRewrite = textToRewrite
            return new Promise((resolve, reject) => {
                let index = 0

                const next = async () => {
                    if (index < processingLanguages.length) {
                        const startLanguage = (index === 0) ? baseLanguage : processingLanguages[index - 1]
                        /* res.text , res.from.text.autoCorrected , res.from.text.value , res.from.text.didYouMean , res.from.language.iso (detecting) */
                        translate(processedRewrite, {from: startLanguage, to: processingLanguages[index]}).then(res => {
                            console.log('translating from ' + startLanguage + ' to ' + processingLanguages[index])
                            console.log(processedRewrite + ' ...became... ' + res.text)
                            processedRewrite = res.text
                            index++
                            next()
                        }).catch(err => {
                            console.error(err);
                        })
                    } else {
                        //TODO DEAL WITH THESAURUS HERE
                        resolve(Object.assign({},
                            {
                                text: textToRewrite,
                                rewrite: processedRewrite
                            }))
                    }
                }
                next()
            })
        },
        rateRewrite: async (_, data) => {
            //TODO ADD THE STUFF TO DB, SUCH AS THROUGH PARSE.JSON
            //data: { language: 'en', processingLanguages: ['es', 'pl'], rating: 3, translator: 'google', wordCount: 263}
            // https://stackoverflow.com/questions/41860792/how-can-i-have-a-datatype-of-array-in-mysql-sequelize-instance
            //https://stackoverflow.com/questions/25565212/how-to-define-array-of-objects-in-sequelize-js
            console.log(data)
            db.models.languageCombination.findOrCreate({
                where: {
                    processingLanguages: data.processingLanguages,
                    language: data.language,
                    translator: data.translator
                }
            }).then(async (languageCombinations, createdNewLanguageCombination) => {
                console.log(languageCombinations, createdNewLanguageCombination)
            })
            return Object.assign({},
                {
                    languageCombinationId: '1234',
                    rating: 3,
                    wordCount: 263
                })
        }
    }
};

// graphql-example file wtweets, user, etc. https://github.com/marmelab/GraphQL-example/blob/master/server/src/schema.js

//doing joins sequelize mysql users... https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins/

//example schema https://github.com/apollographql/graphql-tools/blob/master/docs/source/generate-schema.md

// check the author: and post : which returns author or post, this is to get posts or authors from the linked ID

// huge ass graphql-tools testing file https://github.com/apollographql/graphql-tools/blob/master/src/test/testMocking.ts