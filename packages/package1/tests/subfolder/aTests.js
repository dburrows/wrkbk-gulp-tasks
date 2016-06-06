import Chai from 'chai';
var expect = Chai.expect;

import a from '../../src/subfolder/a';

describe('subfolder a Tests', function () {

  it('should have a msg prop', function () {
    expect(a.msg).to.equal('This is subfolder file a');
  });

});
