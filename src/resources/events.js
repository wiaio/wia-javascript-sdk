/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */
(function (root) {
  root.Wia = root.Wia || {};
  let Wia = root.Wia;

  /**
     * @namespace Provides an interface
     */
  Wia.events = Wia.events || {};

  Wia.events.publish = function (opt, callback) {
    Wia._restClient._post('events', opt, function (data) {
      callback(data);
    }, function (response) {
      callback(response);
    });
  };

  Wia.events.list = function (params, success, failure) {
    if (!params['device.id']) {
      throw new Error('You must provide a device.id property');
    }
    Wia._restClient._get('events', params, function (data) {
      success(data.events, data.count);
    }, function (response) {
      failure(response);
    });
  };

  Wia.events.subscribe = function (data, callback) {
    if (data.name) {
      Wia.stream.subscribe('devices/' + data.device + '/events/' + data.name, callback);
    } else {
      Wia.stream.subscribe('devices/' + data.device + '/events/+', callback);
    }
  };

  Wia.events.unsubscribe = function (data, callback) {
    if (data.name) {
      Wia.stream.unsubscribe('devices/' + data.device + '/events/' + data.name, callback);
    } else {
      Wia.stream.unsubscribe('devices/' + data.device + '/events/+', callback);
    }
  };
}(this));
