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
                include: [{ model: db.models.rating }]
            }).then(languageCombinations => {
                return languageCombinations.map(languageCombination=>{
                    return Object.assign({},
                        {
                            id: languageCombination.id,
                            processingLanguages: languageCombination.processingLanguages,
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
        rateRewrite: (_, data) => {
            return Object.assign({},
                {
                    origional: 'text',
                    translated: 'texto'
                })
        }
    }
};

// graphql-example file wtweets, user, etc. https://github.com/marmelab/GraphQL-example/blob/master/server/src/schema.js

//doing joins sequelize mysql users... https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins/

//example schema https://github.com/apollographql/graphql-tools/blob/master/docs/source/generate-schema.md

// check the author: and post : which returns author or post, this is to get posts or authors from the linked ID

// huge ass graphql-tools testing file https://github.com/apollographql/graphql-tools/blob/master/src/test/testMocking.ts
