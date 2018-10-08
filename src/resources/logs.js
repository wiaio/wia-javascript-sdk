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
  Wia.logs = Wia.logs || {};

  Wia.logs.subscribe = function (data, callback) {
    if (data.name) {
      Wia.stream.subscribe('devices/' + data.device + '/logs/' + data.level, callback);
    } else {
      Wia.stream.subscribe('devices/' + data.device + '/logs/+', callback);
    }
  };

  Wia.logs.unsubscribe = function (data, callback) {
    if (data.name) {
      Wia.stream.unsubscribe('devices/' + data.device + '/logs/' + data.level, callback);
    } else {
      Wia.stream.unsubscribe('devices/' + data.device + '/logs/+', callback);
    }
  };

  Wia.logs.publish = function (opt, callback) {
    if (Wia.clientInfo && Wia.clientInfo.device && Wia.stream && Wia.stream.connected) {
      Wia.stream.publish('devices/' + Wia.clientInfo.device.id + '/logs/' + opt.level, opt ? JSON.stringify(opt) : null, callback);
    } else {
      Wia._restClient._post('events', opt, function (data) {
        callback(data);
      }, function (response) {
        callback(response);
      });
    }
  };

  Wia.logs.list = function (params, success, failure) {
    Wia._restClient._get('logs', params, function (data) {
      success(data.logs, data.count);
    }, function (response) {
      failure(response);
    });
  };
}(this));
