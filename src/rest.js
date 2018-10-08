/*
*  This provides the ability to communicate with Wia's Rest API
*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */
(function (root) {
  root.Wia = root.Wia || {};
  let Wia = root.Wia;

  function addRequestHeaders(xhr) {
    if (Wia.secretKey) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + Wia.secretKey);
    }

    if (Wia.accessToken) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + Wia.accessToken);
    }

    if (Wia.appKey) {
      xhr.setRequestHeader('x-app-key', Wia.appKey);
    }
    return xhr;
  }

  function serializeParameters(obj) {
    let str = [];
    for(let p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  }

  /**
     * @namespace Provides an interface to Wia's Rest API
     */
  Wia._restClient = Wia._restClient || {};

  Wia._restClient._get = function (path, params, success, failure) {
    let xhr = new XMLHttpRequest();
    let url = Wia.restApiEndpoint + path;
    if (params) {
      url = url + ('?' + serializeParameters(params));
    }
    xhr.open('get', url, true);
    xhr = addRequestHeaders(xhr);
    xhr.responseType = 'json';
    xhr.onload = function () {
      let status = xhr.status;
      if (status === 200) {
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

  Wia._restClient._post = function (path, data, success, failure) {
    let xhr = new XMLHttpRequest();
    xhr.open('post', Wia.restApiEndpoint + path, true);
    xhr = addRequestHeaders(xhr);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.responseType = 'json';
    xhr.onload = function () {
      let status = xhr.status;
      if (status === 200 || status === 201) {
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

  Wia._restClient._put = function (path, data, success, failure) {
    let xhr = new XMLHttpRequest();
    xhr.open('put', Wia.restApiEndpoint + path, true);
    xhr = addRequestHeaders(xhr);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.responseType = 'json';
    xhr.onload = function () {
      let status = xhr.status;
      if (status === 200 || status === 201) {
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

  Wia._restClient._delete = function (path, success, failure) {
    let xhr = new XMLHttpRequest();
    xhr.open('delete', Wia.restApiEndpoint + path, true);
    xhr = addRequestHeaders(xhr);
    xhr.responseType = 'json';
    xhr.onload = function () {
      let status = xhr.status;
      if (status === 200) {
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
}(this));
