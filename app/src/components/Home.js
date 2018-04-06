import React, { Component } from 'react';
import {graphql, compose} from 'react-apollo'
import { languages } from "../constants";
import { REWRITE_MUTATION, CREATE_RATING_MUTATION} from "../graphql/mutations"
import { LANGUAGE_COMBINATIONS_QUERY} from "../graphql/queries"
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faTimes, faAngleDoubleRight, faCheck, faAngleDown, faStar } from '@fortawesome/fontawesome-free-solid'
import { Consumer } from "../Context"

const defaultAddedLanguage = 'es'

class Home extends Component {
    render() {
        const LanguageSelectorMap = ({processingLanguages, setState }) => {
        console.log(this.props)
        const {LanguageCombinations} = this.props
        const LanguageSelectorMap = () => {
            const LanguageOptionsMap = () => languages.map(language=>{
                return <option key={language.symbol} value={language.symbol}>{language.language}</option>
            })

            //map options of languages here up to 5
            const updateProcessingLanguages = (newLanguage, index) => {
                processingLanguages[index] = newLanguage
                setState({processingLanguages: processingLanguages})
            }
            return processingLanguages.map((language, index)=> {
                return(
                    <div key={index} className='flex flex-column'>
                        <div className='flex justify-around'>
                            {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                            {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                            {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                        </div>
                        <div className='flex mt1 mb1 ' >
                            <select className='form-control' value={processingLanguages[index]} onChange={(e) => updateProcessingLanguages(e.target.value, index)}>
                                <LanguageOptionsMap/>
                            </select>
                            {(index !== 0) ? <div className='btn btn-danger ml1' onClick={()=>this._removeProcessingLanguage(processingLanguages, index, setState)}><FontAwesomeIcon icon={faTimes}/></div> : null}
                        </div>
                    </div>
                )
            })
        }
        const LanguageCombinationsMap = () => {
            if (LanguageCombinations){
                return LanguageCombinations.map((languageCombination,index)=>{
                    //mapping languageCombinations
                    const languageIndex = languages.map(language=>language.symbol).indexOf(languageCombination.language)
                    const languageStartEnd = languages[languageIndex].language
                    const ProcessingLanguageMap = () => {
                        //mapping processingLanguages
                        return languageCombination.processingLanguages.map((processingLanguage, index) => {
                            const processingLanguageIndex = languages.map(language=>language.symbol).indexOf(processingLanguage)
                            const processingLanguageL = languages[processingLanguageIndex].language
                            return(
                                <div className='flex justify-between items-center' key={index}>
                                    {(index===0)?null:<FontAwesomeIcon className='ml2 mr2' icon={faAngleDoubleRight} size='lg'/>}
                                    <div className='btn btn-info'>{processingLanguageL}</div>
                                </div>
                            )
                        })
                    }
                    return(
                        <tr key={index}>
                            <th scope='row'>{index+1}</th>
                            <td>
                                <div className='btn btn-primary'>{languageStartEnd}</div>
                            </td>
                            <td className='flex justify-center items-center'>
                                <ProcessingLanguageMap />
                            </td>
                            <td>{languageCombination.avgRating}</td>
                            <td>{languageCombination.ratingCount}</td>
                        </tr>
                    )
                })
            } else {
                return(
                    <tr>
                        <th scope='row'>1</th>
                        <td>English</td>
                        <td>Processing Language</td>
                        <td>Score</td>
                        <td>Ratings</td>
                    </tr>
                )
            }
        }
        return (
            <Consumer>{(state)=>{
                const { language,
                    processingLanguages,
                    lastCalledLanguage,
                    loading,
                    text,
                    rated,
                    rewrite,
                    autocorrect,
                    thesaurus,
                    translator,
                    setState} = state
                return(
            <div className=''>
                {/*HEADER*/}
                <div className='row'>
                    <div className='col-12 d-flex justify-content-center align-items-center'>
                        <div>
                            <h1>Full Text Rewriter</h1>
                            <h4>How It Works</h4>
                            <div className=' flex justify-between items-center'>
                                <div className='btn btn-primary'>English</div>
                                <FontAwesomeIcon className='ml2 mr2' icon={faAngleDoubleRight} size='lg'/>
                                <div className='btn btn-info'>Processing Languages</div>
                                <FontAwesomeIcon className='ml2 mr2' icon={faAngleDoubleRight} size='lg'/>
                                <div className='btn btn-success'>English</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*REWRITER*/}
                <div className='row mt3'>
                    <div className='container'>
                        <h2>Rewriter</h2>
                        <div className="row rewriter-container">
                            <div className="col-sm-4 flex flex-column">
                                <h3>Input</h3>
                                <textarea className='form-control flex-1' value={text} onChange={(e)=>setState({text: e.target.value})}/>
                                <div className='flex justify-center mt3'>
                                    <div className="btn btn-primary" onClick={()=>setState({text:'alright, we are about to try something here!'})}>Sample Text</div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <h3>Processing Languages:</h3>
                                <LanguageSelectorMap processingLanguages={processingLanguages} setState={setState} />
                                {(processingLanguages.length < 5)?
                                    <div className='btn btn-info mt1' onClick={()=>this._addProcessingLanguage(processingLanguages, setState)}>Add Language</div>: null}
                            </div>
                            <div className="col-sm-4 flex flex-column">
                                <h3>Result</h3>
                                <div className='rewrite-result flex-1'>{rewrite}</div>
                                {(lastCalledLanguage && !loading) ?
                                    <div className='w-100'>
                                        {(!rated)?<span>Please Rate</span>:<div className='w-100'>Thank You :)</div>}
                                        {(!rated)?
                                        <ul className='pagination pagination-sm flex'>
                                            <li onClick={()=>this._rateRewrite(1, setState, text, language, processingLanguages, translator)} className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>1</li>
                                            <li onClick={()=>this._rateRewrite(2, setState, text, language, processingLanguages, translator)} className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>2</li>
                                            <li onClick={()=>this._rateRewrite(3, setState, text, language, processingLanguages, translator)} className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>3</li>
                                            <li onClick={()=>this._rateRewrite(4, setState, text, language, processingLanguages, translator)} className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>4</li>
                                            <li onClick={()=>this._rateRewrite(5, setState, text, language, processingLanguages, translator)} className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>5</li>
                                        </ul>: null}
                                    </div>
                                : null}
                            </div>
                        </div>
                        <div className="btn btn-success w-100 mt3 btn_rewrite" onClick={()=>this._rewrite(text, language, processingLanguages, setState)}>REWRITE</div>
                    </div>
                </div>
                {/*OPTIONS*/}
                <div className='row'>
                    <div className='container pb3'>
                        <h2>Options</h2>
                        <div className='row'>
                            <div className='col-12 col-sm-4 flex items-center'>
                                <div className='check-box' onClick={()=>setState({autocorrect: !autocorrect})}>{(autocorrect)? <FontAwesomeIcon className='red' icon={faCheck}/> : null}</div>
                                <h4>Autocorrect</h4>
                            </div>
                            <div className='col-12 col-sm-4 flex items-center'>
                                <div className='check-box' onClick={()=>setState({thesaurus: !thesaurus})}>{(thesaurus)? <FontAwesomeIcon className='red' icon={faCheck}/> : null}</div>
                                <h4>Use Thesaurus</h4>
                            </div>
                            <div className='col-12 col-sm-4 flex items-center'>
                                <h4 >Translator</h4>
                                <select className='form-control ml2' onChange={(e)=>setState({translator: e.target.value})}>
                                    <option value='google'>Default</option>
                                    <option value='google'>Google API</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {/*RATINGS*/}
                <div className='mt5 col-12'>
                    <h1>Ratings</h1>
                </div>
                <div className='row mb5'>
                    <div className='container'>
                        <h2>Popular Combinations</h2>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>Start/End Language</th>
                                    <th scope='col'>Processing Language</th>
                                    <th scope='col'>Score</th>
                                    <th scope='col'>Ratings</th>
                                </tr>
                            </thead>
                            <tbody>
                                <LanguageCombinationsMap />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}}</Consumer>
        )
    }
    _addProcessingLanguage = (processingLanguages, simpleSetState) => {
        processingLanguages.push(defaultAddedLanguage)
        simpleSetState({processingLanguages: processingLanguages})
    }
    _removeProcessingLanguage = (processingLanguages, index, simpleSetState) => {
        processingLanguages.splice(index, 1)
        simpleSetState({processingLanguages:  processingLanguages})
    }
    _rateRewrite = async (rating, setState, text, language, processingLanguages, translator) => {
        const wordCount = text.trim().replace(/\s+/gi, ' ').split(' ').length
        setState({rated: true})
        const variables = {
            rating: rating,
            language: language,
            processingLanguages: processingLanguages,
            translator: translator,
            thesaurus: false,
            autocorrect: false,
            wordCount: wordCount
        }
        await this.props.rateRewriteMutation({
            variables: variables,
            update: (store, {data: {rateRewrite}})=> {
                //this.props.languageCombinationsQuery.refetch()
            }
        })
    }
    _rewrite = async (text, language, processingLanguages, setState)=>{
        setState({
            loading: true,
            lastCalledLanguage: language,
            lastProcessedLanguages: processingLanguages,
            rated: false
        })
        await this.props.rewriteMutation({
            variables: {
                text: text,
                language: language,
                processingLanguages: processingLanguages
            },
            update: (store, {data: {rewrite}})=>{
                console.log(rewrite)
                setState({rewrite: rewrite.rewrite, loading: false})
            }
        })
    }
}

export default compose(
    graphql(REWRITE_MUTATION, {name: 'rewriteMutation'}),
    graphql(LANGUAGE_COMBINATIONS_QUERY, {
        props: ({data}) => {
            console.log(data)
            const { LanguageCombinations } = data
            return {LanguageCombinations}
        }
    }),
    graphql(CREATE_RATING_MUTATION, {name: 'rateRewriteMutation'})
)(Home)
