import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faCheck} from "@fortawesome/fontawesome-free-solid/index";

const Options = ({setState, autocorrect, thesaurus, translator}) =>
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

export default Options