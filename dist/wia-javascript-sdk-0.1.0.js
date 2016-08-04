/*
*  Wia Javascript SDK for interfacing with APIs
*
*  Learn more at http://docs.wia.io
*
*  @author Conall Laverty (team@wia.io)
*/

/**
 * The browser console
 *
 * @property console
 * @private
 * @type object
 */
window.console = window.console || {};
window.console.log = this.console.log || function() {};

/**
 * expose our sdk
 */
(function(root) {
  root.Wia = root.Wia || {};
  root.Wia.VERSION = "js1.0.0";
}(this));

/**
 * main sdk
 */
(function(root) {

    root.Wia = root.Wia || {};

    /**
    * Contains all Wia API classes and functions.
    * @name Wia
    * @namespace
    *
    * Contains all Wia API classes and functions.
    */
    var Wia = root.Wia;

    // If jQuery has been included, grab a reference to it.
    if (typeof(root.$) !== "undefined") {
        Wia.$ = root.$;
    }

    // Set the rest server for Wia.
    Wia.restApiBase = "https://api.wia.io/v1/";

    // Set the socket server for Wia.
    Wia.socketApiEndpoint = "wss://api.wia.io:3001";

    /**
     * Call this method first to set your authentication key.
     * @param {String} API Token
     */
    Wia.initialize = function(options) {
        Wia._initialize(options);
    };

    /**
     * This method is for Wia's own private use.
     * @param {String} API Token
     */
    Wia._initialize = function(options) {
      Wia.appKey = options.appKey || null;
      Wia.secretKey = options.secretKey || null;
      Wia.accessToken = options.accessToken || null;
      Wia.restApiBase = options.restApiBase || Wia.restApiBase;
      Wia.socketApiEndpoint = options.socketApiEndpoint || Wia.socketApiEndpoint;
    };
}(this));

/*
*  This provides the ability to communicate with Wia's Rest API
*
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
    Wia._restClient = Wia._restClient || {};

    Wia._restClient._get = function(path, success, failure) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', Wia.restApiBase + path, true);
      xhr = addRequestHeaders(xhr);
      xhr.responseType = 'json';
      xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
          success(xhr.response);
        } else {
          failure({
            status: xhr.status,
            response: xhr.response
          });
        }
      };
      xhr.send();
    };

    Wia._restClient._post = function(path, data, success, failure) {
      var xhr = new XMLHttpRequest();
      xhr.open('post', Wia.restApiBase + path, true);
      xhr = addRequestHeaders(xhr);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.responseType = 'json';
      xhr.onload = function() {
        var status = xhr.status;
        if (status == 200 || status == 201) {
          success(xhr.response);
        } else {
          failure({
            status: xhr.status,
            response: xhr.response
          });
        }
      };
      xhr.send(JSON.stringify(data || {}));
    };

    function addRequestHeaders(xhr) {
      if (Wia.secretKey)
        xhr.setRequestHeader("Authorization", "Bearer " + Wia.secretKey);
      if (Wia.accessToken)
        xhr.setRequestHeader("Authorization", "Bearer " + Wia.accessToken);
      if (Wia.appKey)
        xhr.setRequestHeader("x-app-key", Wia.appKey);
      return xhr;
    }
}(this));

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
