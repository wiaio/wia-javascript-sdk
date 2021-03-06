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

/**
 * expose our sdk
 */
(function(root) {
  root.Wia = root.Wia || {};
  root.Wia.VERSION = "1.0.0";
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

    Wia.restApiEndpoint = "https://api.wia.io/v1/"

    Wia.streamApi = {
      protocol: "wss",
      host: "api.wia.io",
      port: 3001,
      useSecure: true,
      connectTimeout: 1500,
      streamTimeout: 15
    }

    Wia.clientInfo = null;

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
      Wia.restApiEndpoint = options.restApiEndpoint || Wia.restApiEndpoint;

      for (var k in options.streamApi) {
        if (options.streamApi.hasOwnProperty(k)) {
           Wia.streamApi[k] = options.streamApi[k];
        }
      }

      if (Wia.secretKey || Wia.accessToken) {
        intervalId = setInterval(function () {
          Wia._restClient._get("whoami", {}, function(data) {
            Wia.clientInfo = data;
            clearInterval(intervalId);
          }, function(response) {
            console.log(response);
          });
        }, 1250);
      }

      Wia.stream.initialize();
    };
}(this));
