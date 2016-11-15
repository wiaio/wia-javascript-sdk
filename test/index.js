'use strict';

var logger = require('winston');
var expect = require('chai').expect;

var USER_SECRET_KEY = null;

describe('WiaRestApiDevice', function () {
  before(function (done) {
    logger.info("Starting tests.");

    expect(process.env.USER_SECRET_KEY).is.not.a('null');

    USER_SECRET_KEY = process.env.USER_SECRET_KEY;

    done();
  });

  describe('#sendRequestToRestApi', function () {
    it('should send a request to the rest api', function (done) {
      done();
    });
  });

  after(function (done) {
    logger.info("Finished tests.");
    done();
  });
});
