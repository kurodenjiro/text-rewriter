import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight } from '@fortawesome/fontawesome-free-solid'
import {languages} from "../constants";


const LanguageCombinationsMap = ({LanguageCombinations}) => {
    if (LanguageCombinations) {
        return LanguageCombinations.map((languageCombination, index) => {
            //mapping languageCombinations
            const languageIndex = languages.map(language => language.symbol).indexOf(languageCombination.language)
            const languageStartEnd = languages[languageIndex].language
            const ProcessingLanguageMap = () => {
                //mapping processingLanguages
                return languageCombination.processingLanguages.map((processingLanguage, index) => {
                    const processingLanguageIndex = languages.map(language => language.symbol).indexOf(processingLanguage)
                    const processingLanguageL = languages[processingLanguageIndex].language
                    return (
                        <div className='flex justify-between items-center' key={index}>
                            {(index === 0) ? null :
                                <FontAwesomeIcon className='ml2 mr2' icon={faAngleDoubleRight} size='lg'/>}
                            <div className='btn btn-info'>{processingLanguageL}</div>
                        </div>
                    )
                })
            }
            return (
                <tr key={index}>
                    <th scope='row'>{index + 1}</th>
                    <td>
                        <div className='btn btn-primary'>{languageStartEnd}</div>
                    </td>
                    <td className='flex justify-center items-center'>
                        <ProcessingLanguageMap/>
                    </td>
                    <td>{languageCombination.avgRating}</td>
                    <td>{languageCombination.ratingCount}</td>
                </tr>
            )
        })
    } else {
        return (
            <tr>
                <th scope='row'>1</th>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
            </tr>
        )
    }
}
export default LanguageCombinationsMap