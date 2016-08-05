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
    Wia.events = Wia.events || {};

    Wia.events.subscribe = function(data, callback) {
      console.log(Wia.stream);
      if (data.name) {
        Wia.stream.subscribe("devices/" + data.device + "/events/" + data.name, callback);
      } else {
        console.log("devices/" + data.device + "/events/+");
        Wia.stream.subscribe("devices/" + data.device + "/events/+", callback);
      }
    };
}(this));
