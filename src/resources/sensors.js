/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */
(function(root) {
    root.Wia = root.Wia || {};
    var Wia = root.Wia;

    /**
     * @namespace Provides an interface
     */
    Wia.sensors = Wia.sensors || {};

    Wia.sensors.subscribe = function(data, callback) {
      if (data.name) {
        Wia.stream.subscribe("devices/" + data.device + "/sensors/" + data.name, callback);
      } else {
        Wia.stream.subscribe("devices/" + data.device + "/sensors/+", callback);
      }
    };

    Wia.sensors.unsubscribe = function(data, callback) {
      if (data.name) {
        Wia.stream.unsubscribe("devices/" + data.device + "/sensors/" + data.name, callback);
      } else {
        Wia.stream.unsubscribe("devices/" + data.device + "/sensors/+", callback);
      }
    };

    Wia.sensors.publish = function(opt, callback) {
      if (Wia.clientInfo && Wia.clientInfo.device && Wia.stream && Wia.stream.connected) {
        Wia.stream.publish('devices/' + Wia.clientInfo.device.id + '/sensors/' + opt.name, opt ? JSON.stringify(opt) : null, callback);
      } else {
        Wia._restClient._post("events", opt, function(data) {
          callback(data);
        }, function(response) {
          callback(response);
        });
      }
    };

    Wia.sensors.list = function(params, success, failure) {
      Wia._restClient._get('sensors', params, function(data) {
        success(data.sensors, data.count);
      }, function(response) {
        failure(response);
      });
    };
}(this));
