import Chai from 'chai';
var expect = Chai.expect;

import package1 from '../src/package1';

describe('package1 Tests', function () {

  it('should return a string', function () {
    expect(package1()).to.equal('This is package1');
  });

});
