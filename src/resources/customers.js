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
    Wia.customers = Wia.customers || {};

    Wia.customers.signup = function(data, success, failure) {
      Wia._restClient._post('customers/signup', data, function(customer) {
        success(customer);
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
