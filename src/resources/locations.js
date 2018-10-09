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

  Wia.locations.publish = function (opt, callback) {
    Wia._restClient._post('events', opt, function (data) {
      callback(data);
    }, function (response) {
      callback(response);
    });
  };

  Wia.locations.list = function (params, success, failure) {
    Wia._restClient._get('locations', params, function (data) {
      success(data.locations, data.count);
    }, function (response) {
      failure(response);
    });
  };
}(this));
