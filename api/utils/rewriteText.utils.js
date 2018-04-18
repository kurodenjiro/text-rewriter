import { find, filter } from 'lodash'
import contractions from 'contractions'
import WordPOS from 'wordpos'
import thesaurus from 'thesaurus'
const wordpos = new WordPOS()
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
                    //console.log('translating from ' + startLanguage + ' to ' + processingLanguages[index])
                    //console.log(processedRewrite + ' ...became... ' + res.text)
                    processedRewrite = res.text
                    index++
                    next()
                }).catch(err => {
                    console.error(err);
                })
                resolve(processedRewrite)
            }
        }
        next()
    })
}
const sendThroughThesaurus = async (origionalText, rewrite) => {
    const origionalWords = origionalText.trim().replace(/\s+/gi, ' ').replace(/,/g, '').split(' ')
    const rewriteWords = rewrite.trim().replace(/\s+/gi, ' ').replace(/,/g, '').split(' ')
    const wordCount = origionalWords.length
    if (wordCount > 500){
        return({rewrite: rewrite, success: false })
    }
    //todo compare both sentences and give a score
    return new Promise(async (resolve, reject)=>{
        //1. get rid of contractions
        const textNoContractions = await contractions.expand(origionalText)
        //2. get info from wordpos
        const POS = await wordpos.getPOS(textNoContractions)
        const adjectives = POS.adjectives
        const verbs = POS.verbs

        //3. check if adjectives existed in origional text, and occurance number
        const getWordsToSpin = async (wordsArray) => {
            let wordsToSpin = []

            await wordsArray.forEach((word, index) => {
                const origionalWordIndex = origionalWords.indexOf(word)
                if (origionalWordIndex > -1) {
                    const rewriteWordIndex = rewriteWords.indexOf(word)
                    const inRange = rewriteWordIndex < origionalWordIndex + 10 && rewriteWordIndex > origionalWordIndex - 10
                    if (rewriteWordIndex > -1 && inRange) {
                        wordsToSpin.push(word)
                    }
                }
            })
            return wordsToSpin
        }

        //only spins the first word of each that it finds
        let adjectivesToSpin = await getWordsToSpin(adjectives)
        let verbsToSpin = await getWordsToSpin(verbs)

        //4. change the first adjective to one thesaurus result, more in the future todo replace not working
        let newRewrite = rewrite
        const findAndReplaceWords = (words) => {
            return words.forEach(async word=>{
                const synonyms = await thesaurus.find(word)
                newRewrite = newRewrite.replace(word, synonyms[0])
            })
        }
        await findAndReplaceWords(adjectivesToSpin)
        await findAndReplaceWords(verbsToSpin)

        resolve({
            rewrite: newRewrite || rewrite,
            success: true
        })
    })
}
const rewriteText = async (data) => {
    const text = data.text || ''
    const baseLanguage = (data.language) ? data.language: 'en'
    const processingLanguages = (data.processingLanguages && data.processingLanguages.length > 0) ? data.processingLanguages : ['es']
    await processingLanguages.push('en')
    let thesaurusSuccess = true
    let rewrite;
    rewrite = await sendForRewrite(processingLanguages, baseLanguage, text)
    //check for contractions
    if(data.thesaurus){
        const thesaurus = await sendThroughThesaurus(text, rewrite)
        if (!thesaurus.success){thesaurusSuccess = false}//todo set up on front end to give error if false
        rewrite = thesaurus.rewrite
    }
    //check for thesaurus
    const returnValue = { text, rewrite: rewrite, thesaurusSuccess: thesaurusSuccess}
    console.log('final return', returnValue)
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
