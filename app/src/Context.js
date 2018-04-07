import React, { Component, createContext } from 'react'

const defaultState = {
    language: 'en',
    processingLanguages: ['es'],
    lastCalledLanguage: '',
    lastProcessedLanguages: '',//unused except to set it's state
    loading: false,
    rated: false,
    text: '',
    rewrite: '',
    autocorrect: false,
    thesaurus: false,
    translator: 'google'
}

//accepts defaultState if no value passed
const Context = createContext()

export class Provider extends Component {
    constructor(props){
        super(props)
        this.state = defaultState
        this.functions = {
            setState: async (updatedState)=>{
                await this.setState(updatedState)
            }
        }
    }

    render() {
        return(
            <Context.Provider value={{...this.state, ...this.functions}}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const { Consumer } = Context

/*
NOTES:
Consumers require a function as a child
 */