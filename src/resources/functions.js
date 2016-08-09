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
    Wia.functions = Wia.functions || {};

    Wia.functions.list = function(params, success, failure) {
      Wia._restClient._get('functions', params, function(data) {
        success(data.functions, data.count);
      }, function(response) {
        failure(response);
      });
    };

    Wia.functions.call = function(opt, success, failure) {
      if (!opt) {
        return failure({message: "No options specified."});
      }

      var functionId = null;
      var deviceId = null;

      if (typeof opt === "object") {
        functionId = opt.id;
        deviceId = opt.device;
      } else {
        functionId = opt;
      }

      if (deviceId && Wia.stream && Wia.stream.connected) {
        Wia.stream.publish('devices/' + deviceId + '/functions/' + functionId + '/call', opt.data ? JSON.stringify(opt.data) : null, success);
      } else {
        Wia._restClient._post("functions/" + functionId + "/call", params, function(data) {
          success(data);
        }, function(response) {
          failure(response);
        });
      }
    };
}(this));
