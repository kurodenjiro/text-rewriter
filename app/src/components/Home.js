import React, { Component } from 'react';
import {graphql, compose} from 'react-apollo'
import { REWRITE_MUTATION, CREATE_RATING_MUTATION} from "../graphql/mutations"
import { LANGUAGE_COMBINATIONS_QUERY} from "../graphql/queries"
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/fontawesome-free-solid'
import { Consumer } from "../Context"
import LanguageSelectorMap from './LanguageSelector'
import LanguageCombinationsMap from './LanguageCombinationsMap'
import RewriterHeader from './RewriterHeader'
import Options from './Options'

const defaultAddedLanguage = 'es'

class Home extends Component {
    render() {
            console.log(this.props)
        const {LanguageCombinations} = this.props

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
                <RewriterHeader/>
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
                <Options setState={setState} autocorrect={autocorrect} thesaurus={thesaurus} translator={translator} />
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
                                <LanguageCombinationsMap LanguageCombinations={LanguageCombinations} />
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
