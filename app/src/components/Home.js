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
import RewriterOptions from './RewriterOptions'

const defaultAddedLanguage = 'es'

class Home extends Component {//todo stop new language adding - update?
    render() {
        const {LanguageCombinations,
            loading,
            error } = this.props
        return (
            <Consumer>{(context)=>{
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
                    setContext } = context
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
                                        <textarea className='form-control flex-1' value={text} onChange={(e)=>setContext({text: e.target.value})}/>
                                        <div className='flex justify-center mt3'>
                                            <div className="btn btn-primary" onClick={()=>setContext({text:'alright, we are about to try something here!'})}>Sample Text</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <h3>Processing Languages:</h3>
                                        <LanguageSelectorMap
                                            processingLanguages={processingLanguages}
                                            setContext={setContext}
                                            removeProcessingLanguage={this._removeProcessingLanguage}/>
                                        {(processingLanguages.length < 5)?
                                            <div className='btn btn-info mt1' onClick={()=>this._addProcessingLanguage(processingLanguages, setContext)}>Add Language</div>: null}
                                    </div>
                                    <div className="col-sm-4 flex flex-column">
                                        <h3>Result</h3>
                                        <div className='rewrite-result flex-1'>{rewrite}</div>
                                        {(lastCalledLanguage && !loading) ?
                                            <div className='w-100'>
                                                {(!rated)?<span>Please Rate</span>:<div className='w-100'>Thank You :)</div>}
                                                {(!rated)?
                                                    <ul className='pagination pagination-sm flex'>
                                                        {Array(5).fill().map((_, index)=>{
                                                            return(<li key={index} onClick={()=>this._rateRewrite(index+1, setContext, text, language, processingLanguages, translator)} className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>{index+1}</li>)})}
                                                    </ul>: null}
                                            </div>
                                            : null}
                                    </div>
                                </div>
                                <div className="btn btn-success w-100 mt3 btn_rewrite" onClick={()=>this._rewrite(text, language, processingLanguages, autocorrect, thesaurus, translator, setContext)}>REWRITE</div>
                            </div>
                        </div>
                        {/*OPTIONS*/}
                        <RewriterOptions
                            setContext={setContext}
                            autocorrect={autocorrect}
                            thesaurus={thesaurus}
                            translator={translator} />
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
                                    <LanguageCombinationsMap
                                        LanguageCombinations={LanguageCombinations}
                                        queryLoading={loading} queryError={error}/>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}}</Consumer>
        )
    }
    _addProcessingLanguage = (processingLanguages, setContext) => {
        processingLanguages.push(defaultAddedLanguage)
        setContext({processingLanguages: processingLanguages})
    }
    _removeProcessingLanguage = (processingLanguages, index, setContext) => {
        processingLanguages.splice(index, 1)
        setContext({processingLanguages:  processingLanguages})
    }
    _rateRewrite = async (rating, setContext, text, language, processingLanguages, translator) => {
        //todo having processing languages issue when donig 2 rewrites, or from adding languages
        const wordCount = text.trim().replace(/\s+/gi, ' ').split(' ').length
        setContext({rated: true})
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
                this.props.refetchLanguageCombinations()
            }
        })
    }
    _rewrite = async (text, language, processingLanguages, autocorrect, thesaurus, translator, setContext)=>{
        setContext({
            loading: true,
            lastCalledLanguage: language,
            lastProcessedLanguages: processingLanguages,
            rated: false
        })
        await this.props.rewriteMutation({
            variables: {
                text: text,
                language: language,
                processingLanguages: processingLanguages,
                autocorrect: autocorrect,
                thesaurus: thesaurus,
                translator: translator
            },
            update: (store, {data: {rewrite}})=>{
                console.log(rewrite)
                setContext({rewrite: rewrite.rewrite, loading: false})
            }
        })
    }
}


export default compose(
    graphql(REWRITE_MUTATION, {name: 'rewriteMutation'}),
    graphql(LANGUAGE_COMBINATIONS_QUERY, {
        props: ({data}) => {
            const { LanguageCombinations, loading, error, refetch : refetchLanguageCombinations } = data
            return { LanguageCombinations, loading, error, refetchLanguageCombinations }
        }
    }),
    graphql(CREATE_RATING_MUTATION, {name: 'rateRewriteMutation'})
)(Home)
