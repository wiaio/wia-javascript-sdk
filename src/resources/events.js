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
    Wia.events = Wia.events || {};

    Wia.events.subscribe = function(data, callback) {
      if (data.name) {
        Wia.stream.subscribe("devices/" + data.device + "/events/" + data.name, callback);
      } else {
        Wia.stream.subscribe("devices/" + data.device + "/events/+", callback);
      }
    };

    Wia.events.list = function(params, success, failure) {
      Wia._restClient._get('events', params, function(data) {
        success(data.events, data.count);
      }, function(response) {
        failure(response);
      });
    };
}(this));
