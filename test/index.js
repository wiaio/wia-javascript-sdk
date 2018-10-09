/* eslint-disable */
'use strict';

var logger = require('winston');
var expect = require('chai').expect;
var jsdom = require('jsdom-global')();

var Wia = require('../dist/wia').Wia;

var USER_ACCESS_TOKEN = null;
var DEVICE_SECRET_KEY = null;
var DEVICE_ID = null;
var SPACE_ID = null;
var COMMAND_SLUG = null;

describe('Devices', function () {
  before(function (done) {
    logger.info("Starting tests.");

    USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN;
    DEVICE_ID = process.env.DEVICE_ID;
    SPACE_ID = process.env.SPACE_ID;

    Wia.initialize({
      accessToken: USER_ACCESS_TOKEN
    });
    done();
  });

  it('should create a device', function (done) {
    var deviceName = "Device " + new Date().getTime();
    Wia.devices.create({
      name: deviceName,
      spaceId: SPACE_ID
    }, function(device) {
      expect(device).to.exist;
      done();
    }, function(error) {
      expect(error).to.not.exist;
      done();
    });
  });

  it('should retrieve a device', function (done) {
    Wia.devices.retrieve(DEVICE_ID, function(device) {
      expect(device).to.exist;
      done();
    }, function(error) {
      expect(error).to.not.exist;
      done();
    });
  });

  it('should update a device', function (done) {
    var deviceName = "Device " + new Date().getTime();
    Wia.devices.create({
      name: deviceName,
      spaceId: SPACE_ID
    }, function(device) {
      var newDeviceName = "Device " + new Date().getTime();
      Wia.devices.update(device.id, {
        name: newDeviceName
      }, function(updatedDevice) {
        expect(updatedDevice).to.exist;
        expect(updatedDevice.name).to.equal(newDeviceName);
        done();
      }, function(error) {
        done();
      });
    });
  });

  it('should delete a device', function (done) {
    var deviceName = "Device " + new Date().getTime();
    Wia.devices.create({
      name: deviceName,
      spaceId: SPACE_ID
    }, function(device) {
      Wia.devices.delete(device.id, function(device) {
        expect(device).to.exist;
        done();
      }, function(error) {
        expect(error).to.not.exist;
        done();
      });
    });
  });

  it('should retrieve a list of devices', function (done) {
    Wia.devices.list({
      'space.id': SPACE_ID
    }, function(devices, count) {
      expect(devices).to.exist;
      expect(count).to.be.a('number');
      done();
    }, function(error) {
      expect(error).to.not.exist;
      done();
    });
  });
});

describe('Spaces', function () {
  before(function (done) {
    logger.info("Starting tests.");

    USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN;
    DEVICE_ID = process.env.DEVICE_ID;
    SPACE_ID = process.env.SPACE_ID;

    Wia.initialize({
      accessToken: USER_ACCESS_TOKEN
    });
    done();
  });

  it('should create a space', function (done) {
    var spaceName = "Space " + new Date().getTime();
    Wia.spaces.create({
      name: spaceName,
      spaceId: SPACE_ID
    }, function(space) {
      expect(space).to.exist;
      done();
    }, function(error) {
      expect(error).to.not.exist;
      done();
    });
  });

  it('should retrieve a space', function (done) {
    Wia.spaces.retrieve(SPACE_ID, function(space) {
      expect(space).to.exist;
      done();
    }, function(error) {
      expect(error).to.not.exist;
      done();
    });
  });

  it('should update a space', function (done) {
    var spaceName = "Space " + new Date().getTime();
    Wia.spaces.create({
      name: spaceName,
      spaceId: SPACE_ID
    }, function(space) {
      var newSpaceName = "Space " + new Date().getTime();
      Wia.spaces.update(space.id, {
        name: newSpaceName
      }, function(updatedSpace) {
        expect(updatedSpace).to.exist;
        expect(updatedSpace.name).to.equal(newSpaceName);
        done();
      }, function(error) {
        done();
      });
    });
  });

  it('should retrieve a list of spaces', function (done) {
    Wia.spaces.list({
      'space.id': SPACE_ID
    }, function(spaces, count) {
      expect(spaces).to.exist;
      expect(count).to.be.a('number');
      done();
    }, function(error) {
      expect(error).to.not.exist;
      done();
    });
  });
});

describe('Events', function () {
  before(function (done) {
    logger.info("Starting tests.");

    USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN;
    DEVICE_SECRET_KEY = process.env.DEVICE_SECRET_KEY;
    DEVICE_ID = process.env.DEVICE_ID;
    SPACE_ID = process.env.SPACE_ID;

    Wia.initialize({
      secretKey: DEVICE_SECRET_KEY
    });
    done();
  });

  it('should publish an event', function (done) {
    Wia.events.publish({
      name: 'testEvent',
      data: {
        temperature: 21.5
      }
    }, function(event) {
      expect(event).to.exist;
      expect(event.id).to.exist;
      done();
    }, function(error) {
      expect(error).to.not.exist;
      done();
    });
  });
});

describe('Events', function () {
  before(function (done) {
    logger.info("Starting tests.");

    USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN;
    DEVICE_SECRET_KEY = process.env.DEVICE_SECRET_KEY;
    DEVICE_ID = process.env.DEVICE_ID;
    SPACE_ID = process.env.SPACE_ID;

    Wia.initialize({
      accessToken: USER_ACCESS_TOKEN
    });
    done();
  });

  it('should retrieve a list of events', function (done) {
    Wia.events.list({
      'device.id': DEVICE_ID
    }, function(events, count) {
      expect(events).to.exist;
      expect(count).to.be.a('number');
      done();
    }, function(error) {
      expect(error).to.not.exist;
      done();
    });
  });
});

describe('Commands', function () {
  before(function (done) {
    logger.info("Starting tests.");

    USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN;
    DEVICE_SECRET_KEY = process.env.DEVICE_SECRET_KEY;
    DEVICE_ID = process.env.DEVICE_ID;
    SPACE_ID = process.env.SPACE_ID;
    COMMAND_SLUG = process.env.COMMAND_SLUG;

    Wia.initialize({
      accessToken: USER_ACCESS_TOKEN
    });
    done();
  });

  it('should run a command', function (done) {
    Wia.commands.run({
      'device.id': DEVICE_ID,
      slug: COMMAND_SLUG
    }, function(response) {
      expect(response).to.exist;
      expect(response.running).to.equal(true);
      done();
    }, function(error) {
      expect(error).to.not.exist;
      done();
    });
  });
});