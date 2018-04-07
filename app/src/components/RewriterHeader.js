import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faAngleDoubleRight} from "@fortawesome/fontawesome-free-solid/index";

const RewriterHeader = () =>
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

export default RewriterHeader