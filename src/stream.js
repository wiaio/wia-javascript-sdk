/*
*  This provides the ability to communicate with Wia's Stream API
*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */
(function (root) {
  root.Wia = root.Wia || {};
  let Wia = root.Wia;

  /**
     * @namespace Provides an interface to Wia's Rest API
     */
  Wia.stream = Wia.stream || {};

  Wia.stream.connected = false;

  let sockets = {};
  let subscribeCallbacks = {};

  Wia.stream.subscribe = function (path, cb) {
    sockets[path] = new WebSocket(`${Wia.streamApi.protocol}://${Wia.streamApi.host}/${path}`);
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
        const msgObj = JSON.parse(e.data);
        const callCallback = function () {
          if (subscribeCallbacks[path] && typeof subscribeCallbacks[path] === 'function') {
            console.log('Server: ' + e.data);
            subscribeCallbacks[path](msgObj);
          }
        };

        const topic = path;
        if (topic.indexOf('devices') === 0) {
          let topicSplit = topic.match('devices/(.*?)/(.*)');
          if (topicSplit) {
            let topicAction = topicSplit[2];

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
    for (let socket in sockets) {
      if (sockets.hasOwnProperty(socket)) {
        if (Wia.stream.connected) {
          Wia.stream.unsubscribe(socket);
        }
        delete sockets[socket];
      }
    }
  };
}(this));
