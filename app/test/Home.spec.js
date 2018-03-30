import React from 'react';
import { MockedProvider } from "react-apollo/test-utils";
import {LANGUAGE_COMBINATIONS_QUERY} from '../src/graphql'
import Home from '../src/components/Home';

const defaultProps = {
    text: 'this is my child ;)'
}

describe('Home', () => {
    it('should return true', ()=>{
        expect(true).to.equal(true);
    })
    const mockedData = {
        languageCombinations: [
            { __typename: 'languageCombination', id: '1', processingLanguages: ['es'], language: 'en', avgRating: '3.2', ratingCount: 6, ratings: []}
        ]
    }
    const query = LANGUAGE_COMBINATIONS_QUERY//addTypenameToDocument(LANGUAGE_COMBINATIONS_QUERY)
    const variables = {cache: false}
    const wrapper = shallow(
        <MockedProvider mocks={[
                { request: { query, variables }, result: { data: mockedData }}
            ]}>
            <Home/>
        </MockedProvider>);
    const mountedWrapper = mount(
        <MockedProvider mocks={[
            { request: { query, variables }, result: { data: mockedData }}
        ]}>
            <Home/>
        </MockedProvider>)
    // const renderedWrapper = mount(<Child/>)
    it('mockedprovider to have Home component', () => {
        expect(wrapper.contains(<Home />)).to.equal(true);
    });
    it('Rewrite btn to exist and work', () => {
        const rewriteBtn = mountedWrapper.find('.btn_rewrite')
        expect(rewriteBtn).to.have.length(1);
        mountedWrapper.find('textarea').get(0).value('this should be rewritten')
        rewriteBtn.simulate('click')
        expect(mountedWrapper.find('rewrite-result')).to.have.value('string')
    });

})

/*
props appears to refer to properties on div in the child
 */

/*
adding typenames: https://github.com/apollographql/react-apollo/issues/674
graphql test gist https://gist.github.com/jbaxleyiii/b3634aeeab7bdb80ed4119ea5a07ba4a



LINKS:
https://medium.com/@adambisek/how-to-make-integration-tests-for-apollo-react-components-with-graphql-ef0bbd17e686
https://www.npmjs.com/package/apollo-mocknetworkinterface
https://gist.github.com/jbaxleyiii/b3634aeeab7bdb80ed4119ea5a07ba4a
https://github.com/apollographql/react-apollo/issues/674
https://github.com/apollographql/apollo-client/blob/master/packages/apollo-utilities/src/transform.ts
https://github.com/airbnb/enzyme/issues/204
https://facebook.github.io/jest/docs/en/tutorial-react.html
http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
 */
