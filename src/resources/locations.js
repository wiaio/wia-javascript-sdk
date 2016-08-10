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
    Wia.locations = Wia.locations || {};

    Wia.locations.subscribe = function(data, callback) {
      Wia.stream.subscribe("devices/" + data.device + "/locations", callback);
    };

    Wia.locations.unsubscribe = function(data, callback) {
      Wia.stream.unsubscribe("devices/" + data.device + "/locations", callback);
    };

    Wia.locations.list = function(params, success, failure) {
      Wia._restClient._get('locations', params, function(data) {
        success(data.locations, data.count);
      }, function(response) {
        failure(response);
      });
    };
}(this));
