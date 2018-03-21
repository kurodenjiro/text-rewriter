import React, { Component } from 'react';
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'
import { languages } from "../constants";
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faTimes, faAngleDoubleRight, faCheck, faAngleDown, faStar } from '@fortawesome/fontawesome-free-solid'

const defaultAddedLanguage = 'es'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            language: 'en',
            processingLanguages: ['es'],
            lastCalledLanguage: '',
            lastProcessedLanguages: '',
            loading: false,
            text: '',
            rewrite: '',
            autocorrect: false,
            thesaurus: false,
            translator: ''
        }
    }

    render() {
        const LanguageSelectorMap = () => {
            const LanguageOptionsMap = () => languages.map(language=>{
                return <option key={language.symbol} value={language.symbol}>{language.language}</option>
            })

            //map options of languages here up to 5
            const updateProcessingLanguages = (newLanguage, index) => {
                const processingLanguages = this.state.processingLanguages
                processingLanguages[index] = newLanguage
                this.setState({processingLanguages: processingLanguages})
                console.log(processingLanguages)
            }
            return this.state.processingLanguages.map((language, index)=> {
                return(
                    <div key={index} className='flex flex-column'>
                        <div className='flex justify-around'>
                            {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                            {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                            {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                        </div>
                        <div className='flex mt1 mb1 ' >
                            <select className='form-control' value={this.state.processingLanguages[index]} onChange={(e) => updateProcessingLanguages(e.target.value, index)}>
                                <LanguageOptionsMap/>
                            </select>
                            {(index !== 0) ? <div className='btn btn-danger ml1' onClick={()=>this._removeProcessingLanguage(index)}><FontAwesomeIcon icon={faTimes}/></div> : null}
                        </div>
                    </div>
                )
            })
        }//
        return (
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
                                <textarea className='form-control flex-1' value={this.state.text} onChange={(e)=>this.setState({text: e.target.value})}/>
                                <div className='flex justify-center mt3'>
                                    <div className="btn btn-primary" onClick={()=>this.setState({text: 'alright, we are about to try something here!'})}>Use Sample</div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <h3>Processing Languages:</h3>
                                <LanguageSelectorMap />
                                {(this.state.processingLanguages.length < 5)?
                                    <div className='btn btn-info mt1' onClick={this._addProcessingLanguage}>Add Language</div>: null}
                            </div>
                            <div className="col-sm-4 flex flex-column">
                                <h3>Result</h3>
                                <div className='rewrite-result flex-1'>{this.state.rewrite}</div>
                                {(this.state.lastCalledLanguage && !this.state.loading) ?
                                    <div className='w-100'>
                                        <span>Please Rate</span>
                                        <ul className='pagination pagination-sm flex'>
                                            <li className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>1</li>
                                            <li className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>2</li>
                                            <li className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>3</li>
                                            <li className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>4</li>
                                            <li className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>5</li>
                                        </ul>
                                    </div>
                                : null}
                            </div>
                        </div>
                        <div className="btn btn-success w-100 mt3" onClick={this._rewrite}>Rewrite</div>
                    </div>
                </div>
                {/*OPTIONS*/}
                <div className='row'>
                    <div className='container pb3'>
                        <h2>Options</h2>
                        <div className='row'>
                            <div className='col-12 col-sm-4 flex items-center'>
                                <div className='check-box' onClick={()=>this.setState({autocorrect: !this.state.autocorrect})}>{(this.state.autocorrect)? <FontAwesomeIcon className='red' icon={faCheck}/> : null}</div>
                                <h4>Autocorrect</h4>
                            </div>
                            <div className='col-12 col-sm-4 flex items-center'>
                                <div className='check-box' onClick={()=>this.setState({thesaurus: !this.state.thesaurus})}>{(this.state.thesaurus)? <FontAwesomeIcon className='red' icon={faCheck}/> : null}</div>
                                <h4>Use Thesaurus</h4>
                            </div>
                            <div className='col-12 col-sm-4 flex items-center'>
                                <h4 >Translator</h4>
                                <select className='form-control ml2' onChange={(e)=>this.setState({translator: e.target.value})}>
                                    <option value='default'>Default</option>
                                    <option value='google'>Google API</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {/*RATINGS*/}
                <div className='mt5 col-12'>
                    <h1>Ratings (Almost Setup, Not Deployed)</h1>
                </div>
                <div className='row'>
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
                                <tr>
                                    <th scope='row'>1</th>
                                    <td>English</td>
                                    <td>Processing Language</td>
                                    <td>Score</td>
                                    <td>Ratings</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
    _addProcessingLanguage = () => {
        this.state.processingLanguages.push(defaultAddedLanguage)
        this.setState({processingLanguages: this.state.processingLanguages})
    }
    _removeProcessingLanguage = (index) => {
        this.state.processingLanguages.splice(index, 1)
        this.setState({processingLanguages: this.state.processingLanguages})
    }
    _rewrite = async ()=>{
        const text = this.state.text
        const language = this.state.language
        const processingLanguages = this.state.processingLanguages
        console.log('processing...')
        this.setState({
            lastCalledLanguage: this.state.language,
            lastProcessedLanguages: this.state.processingLanguages,
            loading: true
        })
        await this.props.rewriteMutation({
            variables: {
                text: text,
                language: language,
                processingLanguages: processingLanguages
            },
            update: (store, {data: {rewrite}})=>{
                console.log(rewrite)
                this.setState({
                    rewrite: rewrite.rewrite,
                    loading: false
                })
            }
        })
    }
}

const REWRITE_MUTATION = gql`
mutation RewriteMutation($text: String!, $language: String!, $processingLanguages: [String]) {
    rewrite(text: $text, language: $language, processingLanguages: $processingLanguages){
        rewrite
}}`

export default compose(
    graphql(REWRITE_MUTATION, {name: 'rewriteMutation'})
)(Home)
