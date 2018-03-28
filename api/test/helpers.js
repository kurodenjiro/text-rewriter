import { expect, assert } from 'chai';
import { sinon, spy } from 'sinon';
import 'babel-polyfill'; //imported because issue https://github.com/babel/babel/issues/5085

global.expect = expect;
global.assert = assert;
global.sinon = sinon;
global.spy = spy;


