import React, { Component, createContext } from 'react'

const defaultState = {
    language: 'en',
    processingLanguages: ['es'],
    lastCalledLanguage: '',
    lastProcessedLanguages: '',
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
            setState: async (item, value)=>{//if you put an item that doesn't exist, will break
                const objProperties = item.split('.')
                let object = ''
                await objProperties.map(objProp=> {
                    object += '{\"' + objProp + '\":'
                })
                object +=  '\"'+value.toString()+'\"'+'}'.repeat(objProperties.length)
                const stateUpdate = JSON.parse(object)
                this.setState(stateUpdate)
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