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

    Wia._restClient._get = function(path, params, success, failure) {
      var xhr = new XMLHttpRequest();
      var url = Wia.restApiEndpoint + path;
      if (params) {
        url += "?" + serializeParameters(params);
      }
      xhr.open('get', url, true);
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
      xhr.open('post', Wia.restApiEndpoint + path, true);
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

    Wia._restClient._put = function(path, data, success, failure) {
      var xhr = new XMLHttpRequest();
      xhr.open('put', Wia.restApiEndpoint + path, true);
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

    Wia._restClient._delete = function(path, success, failure) {
      var xhr = new XMLHttpRequest();
      xhr.open('delete', Wia.restApiEndpoint + path, true);
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

    function addRequestHeaders(xhr) {
      if (Wia.secretKey) {
        xhr.setRequestHeader("Authorization", "Bearer " + Wia.secretKey);
      }

      if (Wia.accessToken) {
        xhr.setRequestHeader("Authorization", "Bearer " + Wia.accessToken);
      }

      if (Wia.appKey) {
        xhr.setRequestHeader("x-app-key", Wia.appKey);
      }
      return xhr;
    }

    function serializeParameters(obj) {
      var str = [];
      for(var p in obj) {
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      }
      return str.join("&");
    }
}(this));
