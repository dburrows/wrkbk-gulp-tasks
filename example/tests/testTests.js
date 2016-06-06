import Chai from 'chai';
var expect = Chai.expect;

import test from '../src/test';

describe('test', function () {
  it('package1 should be importable', function () {
    expect(test.p1).to.equal('This is package1');
  });

});
