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

  Wia.logs.publish = function (opt, callback) {
    Wia._restClient._post('events', opt, function (data) {
      callback(data);
    }, function (response) {
      callback(response);
    });
  };

  Wia.logs.list = function (params, success, failure) {
    Wia._restClient._get('logs', params, function (data) {
      success(data.logs, data.count);
    }, function (response) {
      failure(response);
    });
  };
}(this));
