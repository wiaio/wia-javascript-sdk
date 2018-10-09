function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
(function (root) {
  root.Wia = root.Wia || {};
  root.Wia.VERSION = '1.0.0';
})(this);
/**
 * main sdk
 */


(function (root) {
  root.Wia = root.Wia || {};
  /**
    * Contains all Wia API classes and functions.
    * @name Wia
    * @namespace
    *
    * Contains all Wia API classes and functions.
    */

  var Wia = root.Wia; // If jQuery has been included, grab a reference to it.

  if (typeof root.$ !== 'undefined') {
    Wia.$ = root.$;
  }

  Wia.restApiEndpoint = 'https://api.wia.io/v1/'; // Wia.restApiEndpoint = 'http://local.wia.io:8081/v1/';

  Wia.streamApi = {
    protocol: 'wss',
    host: 'websockets.wia.io',
    // host: 'local.wia.io:3000',
    port: 3001,
    useSecure: true,
    connectTimeout: 1500,
    streamTimeout: 15
  };
  Wia.clientInfo = null;
  /**
     * Call this method first to set your authentication key.
     * @param {String} options API Token
     * @returns {void}
     */

  Wia.initialize = function (options) {
    Wia._initialize(options);
  };
  /**
     * This method is for Wia's own private use.
     * @param {String} options API Token
     * @returns {void}
     */


  Wia._initialize = function (options) {
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
      var intervalId = setInterval(function () {
        Wia._restClient._get('whoami', {}, function (data) {
          Wia.clientInfo = data;
          clearInterval(intervalId);
        }, function (response) {
          console.log(response);
        });
      }, 1250);
    } // Wia.stream.initialize();

  };
})(this);
/*
*  This provides the ability to communicate with Wia's Rest API
*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */


(function (root) {
  root.Wia = root.Wia || {};
  var Wia = root.Wia;

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
    var str = [];

    for (var p in obj) {
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
    var xhr = new XMLHttpRequest();
    var url = Wia.restApiEndpoint + path;

    if (params) {
      url = url + ('?' + serializeParameters(params));
    }

    xhr.open('get', url, true);
    xhr = addRequestHeaders(xhr);
    xhr.responseType = 'json';

    xhr.onload = function () {
      var status = xhr.status;

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
    var xhr = new XMLHttpRequest();
    xhr.open('post', Wia.restApiEndpoint + path, true);
    xhr = addRequestHeaders(xhr);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.responseType = 'json';

    xhr.onload = function () {
      var status = xhr.status;

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
    var xhr = new XMLHttpRequest();
    xhr.open('put', Wia.restApiEndpoint + path, true);
    xhr = addRequestHeaders(xhr);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.responseType = 'json';

    xhr.onload = function () {
      var status = xhr.status;

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
    var xhr = new XMLHttpRequest();
    xhr.open('delete', Wia.restApiEndpoint + path, true);
    xhr = addRequestHeaders(xhr);
    xhr.responseType = 'json';

    xhr.onload = function () {
      var status = xhr.status;

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
})(this);
/*
*  This provides the ability to communicate with Wia's Stream API
*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */


(function (root) {
  root.Wia = root.Wia || {};
  var Wia = root.Wia;
  /**
     * @namespace Provides an interface to Wia's Rest API
     */

  Wia.stream = Wia.stream || {};
  Wia.stream.connected = false;
  var sockets = {};
  var subscribeCallbacks = {};

  Wia.stream.subscribe = function (path, cb) {
    sockets[path] = new WebSocket("".concat(Wia.streamApi.protocol, "://").concat(Wia.streamApi.host, "/").concat(path));

    if (cb && typeof cb === 'function') {
      subscribeCallbacks[path] = cb;
    }

    sockets[path].onopen = function () {
      Wia.stream.connected = true;
      console.log('Connected to stream!');
    };

    sockets[path].onclose = function () {
      Wia.stream.connected = false;
      console.log('Not connected to stream.');
    };

    sockets[path].onerror = function (error) {
      Wia.stream.connected = false;
      console.log('WebSocket Error ' + error);
      console.log('Not connected to stream.');
    };

    sockets[path].onmessage = function (e) {
      Wia.stream.connected = true;

      try {
        var msgObj = JSON.parse(e.data);

        var callCallback = function callCallback() {
          if (subscribeCallbacks[path] && typeof subscribeCallbacks[path] === 'function') {
            console.log('Server: ' + e.data);
            subscribeCallbacks[path](msgObj);
          }
        };

        var topic = path;

        if (topic.indexOf('devices') === 0) {
          var topicSplit = topic.match('devices/(.*?)/(.*)');

          if (topicSplit) {
            var topicAction = topicSplit[2];

            if (topicAction.indexOf('locations') === 0) {
              if (msgObj.type === 'location') {
                callCallback();
              }
            } else if (topicAction.indexOf('events') === 0) {
              if (msgObj.type === 'event') {
                callCallback();
              }
            } else if (topicAction.indexOf('logs') === 0) {
              if (msgObj.type === 'log') {
                callCallback();
              }
            }
          } else {
            callCallback();
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
  };

  Wia.stream.unsubscribe = function (path) {
    sockets[path].close();
    Wia.stream.connected = false;
  };

  Wia.stream.unsubscribeAll = function () {
    for (var socket in sockets) {
      if (sockets.hasOwnProperty(socket)) {
        if (Wia.stream.connected) {
          Wia.stream.unsubscribe(socket);
        }

        delete sockets[socket];
      }
    }
  };
})(this);
/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */


(function (root) {
  root.Wia = root.Wia || {};
  var Wia = root.Wia;
  /**
     * @namespace Provides an interface to Wia's Rest API
     */

  Wia.commands = Wia.commands || {};

  Wia.commands.subscribe = function (opt, callback) {
    if (!opt) {
      throw new Error('Options cannot be null');
    }

    if (typeof Wia.clientInfo !== 'undefined' && typeof Wia.clientInfo.id !== 'undefined') {
      Wia.stream.subscribe('devices/' + Wia.clientInfo.id + '/commands/' + opt.slug + '/run', callback);
    } else {
      setTimeout(function () {
        if (typeof Wia.clientInfo !== 'undefined' && typeof Wia.clientInfo.id !== 'undefined') {
          Wia.stream.subscribe('devices/' + Wia.clientInfo.id + '/commands/' + opt.slug + '/run', callback);
        }
      }, 5000);
    }
  };

  Wia.commands.run = function (opt, success, failure) {
    if (!opt) {
      throw new Error('Options cannot be null');
    }

    Wia._restClient._post('commands/run', opt, function (response) {
      if (success && typeof success === 'function') {
        success(response);
      }
    }, function (response) {
      if (failure && typeof failure === 'function') {
        failure(response);
      }
    });
  };
})(this);
/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */


(function (root) {
  root.Wia = root.Wia || {};
  var Wia = root.Wia;
  /**
     * @namespace Provides an interface to Wia's Rest API
     */

  Wia.devices = Wia.devices || {};

  Wia.devices.create = function (data, success, failure) {
    if (!data) {
      throw new Error('Options cannot be null');
    }

    if (!data.name) {
      throw new Error('You must provide a Device name');
    }

    if (!data.spaceId && !data.space && !data['space.id']) {
      throw new Error('You must provide a spaceId property');
    }

    Wia._restClient._post('devices', data, function (device) {
      if (success && typeof success === 'function') {
        success(device);
      }
    }, function (response) {
      if (failure && typeof failure === 'function') {
        failure(response);
      }
    });
  };

  Wia.devices.retrieve = function (deviceId, success, failure) {
    if (!deviceId || typeof deviceId !== 'string') {
      throw new Error('You must provide a valid Device ID');
    }

    Wia._restClient._get('devices/' + deviceId, {}, function (device) {
      if (success && typeof success === 'function') {
        success(device);
      }
    }, function (response) {
      if (failure && typeof failure === 'function') {
        failure(response);
      }
    });
  };

  Wia.devices.update = function (deviceId, data, success, failure) {
    if (!deviceId || typeof deviceId !== 'string') {
      throw new Error('You must provide a valid Device ID');
    }

    Wia._restClient._put('devices/' + deviceId, data, function (device) {
      if (success && typeof success === 'function') {
        success(device);
      }
    }, function (response) {
      if (failure && typeof failure === 'function') {
        failure(response);
      }
    });
  };

  Wia.devices.delete = function (deviceId, success, failure) {
    if (!deviceId || typeof deviceId !== 'string') {
      throw new Error('You must provide a valid Device ID');
    }

    Wia._restClient._delete('devices/' + deviceId, function (device) {
      if (success && typeof success === 'function') {
        success(device);
      }
    }, function (response) {
      if (failure && typeof failure === 'function') {
        failure(response);
      }
    });
  };

  Wia.devices.list = function (params, success, failure) {
    if (!params['space.id']) {
      throw new Error('You must provide a space.id property');
    }

    Wia._restClient._get('devices', params, function (data) {
      if (success && typeof success === 'function') {
        success(data.devices, data.count);
      }
    }, function (response) {
      if (failure && typeof failure === 'function') {
        failure(response);
      }
    });
  };

  Wia.devices.subscribe = function (data, callback) {
    if (_typeof(data) === 'object') {
      if (data.id) {
        Wia.stream.subscribe('devices/' + data.id, callback);
      }
    } else {
      Wia.stream.subscribe('devices/' + data, callback);
    }
  };

  Wia.devices.unsubscribe = function (data) {
    if (_typeof(data) === 'object') {
      if (data.id) {
        Wia.stream.unsubscribe('devices/' + data.id);
      }
    } else {
      Wia.stream.unsubscribe('devices/' + data);
    }
  };
})(this);
/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */


(function (root) {
  root.Wia = root.Wia || {};
  var Wia = root.Wia;
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

  Wia.events.subscribe = function (data, callback) {
    if (data.name) {
      Wia.stream.subscribe('devices/' + data.device + '/events/' + data.name, callback);
    } else {
      Wia.stream.subscribe('devices/' + data.device + '/events/+', callback);
    }
  };

  Wia.events.unsubscribe = function (data, callback) {
    if (data.name) {
      Wia.stream.unsubscribe('devices/' + data.device + '/events/' + data.name, callback);
    } else {
      Wia.stream.unsubscribe('devices/' + data.device + '/events/+', callback);
    }
  };
})(this);
/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */


(function (root) {
  root.Wia = root.Wia || {};
  var Wia = root.Wia;
  /**
     * @namespace Provides an interface
     */

  Wia.functions = Wia.functions || {};

  Wia.functions.list = function (params, success, failure) {
    Wia._restClient._get('functions', params, function (data) {
      success(data.functions, data.count);
    }, function (response) {
      failure(response);
    });
  };

  Wia.functions.call = function (opt, success, failure) {
    if (!opt) {
      return failure({
        message: 'No options specified.'
      });
    }

    var functionId = null;

    if (_typeof(opt) === 'object') {
      functionId = opt.id;
    } else {
      functionId = opt;
    }

    Wia._restClient._post('functions/' + functionId + '/call', opt, function (data) {
      success(data);
    }, function (response) {
      failure(response);
    });
  };
})(this);
/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */


(function (root) {
  root.Wia = root.Wia || {};
  var Wia = root.Wia;
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

  Wia.locations.subscribe = function (data, callback) {
    Wia.stream.subscribe('devices/' + data.device + '/locations', callback);
  };

  Wia.locations.unsubscribe = function (data, callback) {
    Wia.stream.unsubscribe('devices/' + data.device + '/locations', callback);
  };
})(this);
/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */


(function (root) {
  root.Wia = root.Wia || {};
  var Wia = root.Wia;
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

  Wia.logs.subscribe = function (data, callback) {
    if (data.name) {
      Wia.stream.subscribe('devices/' + data.device + '/logs/' + data.level, callback);
    } else {
      Wia.stream.subscribe('devices/' + data.device + '/logs/+', callback);
    }
  };

  Wia.logs.unsubscribe = function (data, callback) {
    if (data.name) {
      Wia.stream.unsubscribe('devices/' + data.device + '/logs/' + data.level, callback);
    } else {
      Wia.stream.unsubscribe('devices/' + data.device + '/logs/+', callback);
    }
  };
})(this);
/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */


(function (root) {
  root.Wia = root.Wia || {};
  var Wia = root.Wia;
  /**
     * @namespace Provides an interface to Wia's Rest API
     */

  Wia.spaces = Wia.spaces || {};

  Wia.spaces.create = function (data, success, failure) {
    if (!data) {
      throw new Error('Options cannot be null');
    }

    Wia._restClient._post('spaces', data, function (space) {
      if (success && typeof success === 'function') {
        success(space);
      }
    }, function (response) {
      if (failure && typeof failure === 'function') {
        failure(response);
      }
    });
  };

  Wia.spaces.retrieve = function (spaceId, success, failure) {
    if (!spaceId || typeof spaceId !== 'string') {
      throw new Error('You must provide a valid Space ID');
    }

    Wia._restClient._get('spaces/' + spaceId, {}, function (space) {
      if (success && typeof success === 'function') {
        success(space);
      }
    }, function (response) {
      if (failure && typeof failure === 'function') {
        failure(response);
      }
    });
  };

  Wia.spaces.update = function (spaceId, data, success, failure) {
    if (!spaceId || typeof spaceId !== 'string') {
      throw new Error('You must provide a valid Space ID');
    }

    Wia._restClient._put('spaces/' + spaceId, data, function (space) {
      if (success && typeof success === 'function') {
        success(space);
      }
    }, function (response) {
      if (failure && typeof failure === 'function') {
        failure(response);
      }
    });
  };

  Wia.spaces.list = function (params, success, failure) {
    Wia._restClient._get('spaces', params, function (data) {
      if (success && typeof success === 'function') {
        success(data.spaces, data.count);
      }
    }, function (response) {
      if (failure && typeof failure === 'function') {
        failure(response);
      }
    });
  };
})(this);
/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */


(function (root) {
  root.Wia = root.Wia || {};
  var Wia = root.Wia;
  /**
     * @namespace Provides an interface
     */

  Wia.users = Wia.users || {};

  Wia.users.retrieve = function (userId, success, failure) {
    Wia._restClient._get('users/' + userId, {}, function (user) {
      success(user);
    }, function (response) {
      failure(response);
    });
  };
})(this);