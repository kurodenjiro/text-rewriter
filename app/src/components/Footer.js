import React, { Component } from 'react';

class Footer extends Component {
    render(){
        return(
            <div className='footer flex justify-end items-center'>
                <a className='mr4' href='/home'>Main Site</a>
                <a className='mr3' href='/api'>API</a>
            </div>
        )
    }
}

export default Footer;

