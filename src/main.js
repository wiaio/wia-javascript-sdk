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
  root.Wia.VERSION = "0.2.2";
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

    // Set the socket host for Wia.
    Wia.socketApiHost = "api.wia.io";

    // Set the socket host for Wia.
    Wia.socketApiPort = 3001;

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
