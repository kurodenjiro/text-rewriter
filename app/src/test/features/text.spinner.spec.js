import React from 'react';


describe('Text Spinner', () => {

    it('presents text spinner input', () =>{
        const home = shallow(<Home store={fakeStore()} />),
          unspunText = home.find('.ft-unspun-text');

            expect(unspunText).to.have.length(1);
    })

});

const fakeStore = (state = {}) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
});


/* NOTES FROM DAVE
- Presents an rewriter input
- can choose a language
- Rewriter converts english to Spanish back to English
- Presents rating bar once text has been rewritten
- Auto corrects incorrect text
- Uses a thesaurus to help rewrite text
- Uses google as the text translator



It(‘Presents an rewriter input’,

<AppDomain>.<FeatureName>.spec.js

Way to move forward is to check if the thing exists, then check function of that thing after test fails once, then passes when you add the input, so you never have to do functional tests.

For rewriter, make sure input exists, make sure when sample text hit that input has that text. Make sure processing language has options, then you can add language each time, and that when you simulate X click, the length decreases by 1. etc.
 */