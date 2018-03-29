import React from 'react';
//import { graphql } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import {LANGUAGE_COMBINATIONS_QUERY} from '../src/graphql'
//import { addTypenameToDocument } from "apollo-client";
import Home from '../src/components/Home';
//graphql test gist https://gist.github.com/jbaxleyiii/b3634aeeab7bdb80ed4119ea5a07ba4a

const defaultProps = {
    text: 'this is my child ;)'
}

describe('Home', () => {
    it('should return true', ()=>{
        expect(true).to.equal(true);
    })
    const mockedData = {
        languageCombinations: [
            { id: '1', processingLanguages: ['es'], language: 'en', avgRating: '3.2', ratingCount: 6, ratings: [], __typename: 'languageCombination' }
        ]
    }
    const query = LANGUAGE_COMBINATIONS_QUERY//addTypenameToDocument(LANGUAGE_COMBINATIONS_QUERY)
    const variables = {cache: false}
    const wrapper = shallow(<Home />);
    const mountedWrapper = mount(
        <MockedProvider mocks={[
            { request: { query, variables }, result: { data: mockedData }}
        ]}>
            <Home/>
        </MockedProvider>)
    // const renderedWrapper = mount(<Child/>)
    //
    it('should have a div wrapper', () => {
        expect(mountedWrapper.type()).to.equal('div');
    });
    // it('should have text with \'this is my child ;)\'', () => {
    //     expect(wrapper).to.have.text('this is my child ;)');
    // });

})

/*
props appears to refer to properties on div in the child
 */
