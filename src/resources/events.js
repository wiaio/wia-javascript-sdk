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
}(this));
