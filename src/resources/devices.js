/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */
(function(root) {
    root.Wia = root.Wia || {};
    var Wia = root.Wia;

    /**
     * @namespace Provides an interface to Wia's Rest API
     */
    Wia.devices = Wia.devices || {};

    Wia.devices.create = function(data, success, failure) {
      Wia._restClient._post('devices', data, function(device) {
        success(device);
      }, function(response) {
        failure(response);
      });
    };

    Wia.devices.retrieve = function(deviceId, success, failure) {
      Wia._restClient._get('devices/' + deviceId, {}, function(device) {
        success(device);
      }, function(response) {
        failure(response);
      });
    };

    Wia.devices.update = function(deviceId, data, success, failure) {
      Wia._restClient._put('devices/' + deviceId, data, function(device) {
        success(device);
      }, function(response) {
        failure(response);
      });
    };

    Wia.devices.delete = function(deviceId, success, failure) {
      Wia._restClient._delete('devices/' + deviceId, function(device) {
        success(device);
      }, function(response) {
        failure(response);
      });
    };

    Wia.devices.list = function(params, success, failure) {
      Wia._restClient._get('devices', params, function(data) {
        success(data.devices, data.count);
      }, function(response) {
        failure(response);
      });
    };

    Wia.devices.subscribe = function(data, callback) {
      if (typeof data === "object") {
        if (data.id) {
          Wia.stream.subscribe("devices/" + data.id + "/#", callback);
        }
      } else {
        Wia.stream.subscribe("devices/" + data + "/#", callback);
      }
    };

    Wia.devices.unsubscribe = function(data, callback) {
      if (typeof data === "object") {
        if (data.id) {
          Wia.stream.unsubscribe("devices/" + data.id + "/#", callback);
        }
      } else {
        Wia.stream.unsubscribe("devices/" + data + "/#", callback);
      }
    };
}(this));
