import { find, filter } from 'lodash'
const translate = require('google-translate-api')

const sendForRewrite = async (processingLanguages, baseLanguage, textToRewrite) => {
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
                resolve(processedRewrite)
            }
        }
        next()
    })
}
const sendThroughThesaurus = async (origionalText, rewrite) => {
    //todo possibly add contract expander for when using pos to figure out nouns
    //todo compare both sentences
    //todo create simple model: use wordpos to find adjectives/nouns, specify length, check if in origionalText, if so, use thesaurus (see if can get rating of how likely thesaurus would work), check word count to make sure under 500 or something
    return new Promise((resolve, reject)=>{
        resolve(rewrite)
    })
}
const rewriteText = async (data) => {
    const text = data.text || ''
    const baseLanguage = (data.language) ? data.language: 'en'
    const processingLanguages = (data.processingLanguages && data.processingLanguages.length > 0) ? data.processingLanguages : ['es']
    await processingLanguages.push('en')
    let rewrite;
    rewrite = await sendForRewrite(processingLanguages, baseLanguage, text)
    //check for contractions
    if(data.thesaurus || true){
        rewrite = await sendThroughThesaurus(text, rewrite)
    }
    //check for thesaurus
    const returnValue = { text, rewrite: rewrite}
    console.log(returnValue)
    return returnValue
}

export default rewriteText



// NOTES
/*
Find nouns - https://www.npmjs.com/package/pos
Find anything from sentence word by word wordpos - https://github.com/moos/wordpos
 with output {nouns, verbs, adjectives, adverbs, rest}
Compare strings https://www.npmjs.com/package/string-similarity
thesaurus https://www.npmjs.com/package/thesaurus
 */
