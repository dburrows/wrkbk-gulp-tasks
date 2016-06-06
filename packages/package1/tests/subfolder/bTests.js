import Chai from 'chai';
var expect = Chai.expect;

import b from '../../src/subfolder/b';

describe('subfolder b Tests', function () {

  it('should be a string', function () {
    expect(b).to.equal('This is subfolder file b');
  });

});
