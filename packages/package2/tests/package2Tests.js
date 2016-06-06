import Chai from 'chai';
var expect = Chai.expect;

import { name } from '../src/package2';

describe('package2 Tests', function () {

  it('name should return a string', function () {
    expect(name()).to.equal('buzz');
  });

});
