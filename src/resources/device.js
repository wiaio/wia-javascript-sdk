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

    Wia.devices.create = function(data, callback) {
      if (callback) {
        callback(data);
      }
    };

    Wia.devices.retrieve = function(deviceId, success, failure) {
      Wia._restClient._get('devices/' + deviceId, function(device) {
        success(device);
      }, function(response) {
        failure(response);
      });
    }
}(this));

//
// return new Promise(function(resolve, reject) {
//   var xhr = new XMLHttpRequest();
//   xhr.open('get', url, true);
//   xhr.responseType = 'json';
//   xhr.onload = function() {
//     var status = xhr.status;
//     if (status == 200) {
//       resolve(xhr.response);
//     } else {
//       reject(status);
//     }
//   };
//   xhr.send();
// });
