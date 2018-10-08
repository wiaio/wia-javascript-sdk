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
  Wia.locations = Wia.locations || {};

  Wia.locations.subscribe = function (data, callback) {
    Wia.stream.subscribe('devices/' + data.device + '/locations', callback);
  };

  Wia.locations.unsubscribe = function (data, callback) {
    Wia.stream.unsubscribe('devices/' + data.device + '/locations', callback);
  };

  Wia.locations.publish = function (opt, callback) {
    if (Wia.clientInfo && Wia.clientInfo.device && Wia.stream && Wia.stream.connected) {
      Wia.stream.publish('devices/' + Wia.clientInfo.device.id + '/locations/', opt ? JSON.stringify(opt) : null, callback);
    } else {
      Wia._restClient._post('events', opt, function (data) {
        callback(data);
      }, function (response) {
        callback(response);
      });
    }
  };

  Wia.locations.list = function (params, success, failure) {
    Wia._restClient._get('locations', params, function (data) {
      success(data.locations, data.count);
    }, function (response) {
      failure(response);
    });
  };
}(this));
