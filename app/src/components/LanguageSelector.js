import React from 'react'
import { languages } from "../constants";
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faTimes, faAngleDown } from '@fortawesome/fontawesome-free-solid'

const LanguageSelectorMap = ({processingLanguages, setContext, removeProcessingLanguage }) => {
    const LanguageOptionsMap = () => languages.map(language => {
        return <option key={language.symbol} value={language.symbol}>{language.language}</option>
    })//

    //map options of languages here up to 5
    const updateProcessingLanguages = (newLanguage, index) => {
        processingLanguages[index] = newLanguage
        setContext({processingLanguages: processingLanguages})
    }
    return processingLanguages.map((language, index) => {
        return (
            <div key={index} className='flex flex-column'>
                <div className='flex justify-around'>
                    {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                    {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                    {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                </div>
                <div className='flex mt1 mb1 '>
                    <select className='form-control' value={processingLanguages[index]}
                            onChange={(e) => updateProcessingLanguages(e.target.value, index)}>
                        <LanguageOptionsMap/>
                    </select>
                    {(index !== 0) ? <div className='btn btn-danger ml1'
                                          onClick={() => removeProcessingLanguage(processingLanguages, index, setContext)}>
                        <FontAwesomeIcon icon={faTimes}/></div> : null}
                </div>
            </div>
        )
    })
}

export default LanguageSelectorMap
