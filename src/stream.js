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

  let subscribeCallbacks = {};


  let mqttClient = null;

  Wia.stream.initialize = function () {
    console.log(Wia.streamApi);

    mqttClient = new Paho.MQTT.Client(Wia.streamApi.host, parseInt(Wia.streamApi.port), '/', '');

    mqttClient.onConnectionLost = function (response) {
      Wia.stream.connected = false;
      if (Wia.stream.onConnectionLost) {
        Wia.stream.onConnectionLost(response);
      }

      setTimeout(function () {
        console.log('Attempting reconnect...');
        mqttClient.connect({
          onSuccess: function () {
            console.log('Reconnected.');
            for (let topic in subscribeCallbacks) {
              if (subscribeCallbacks.hasOwnProperty(topic)) {
                mqttClient.subscribe(topic);
              }
            }
          },
          onFailure: function () {
            console.log('Could not reconnect.');
          }
        }, Wia.streamApi.connectTimeout);
      });
    };

    mqttClient.onMessageArrived = function (message) {
      let topic = message.destinationName;

      try {
        if (topic.indexOf('devices') === 0) {
          let topicSplit = topic.match('devices/(.*?)/(.*)');
          if (topicSplit) {
            let deviceId = topicSplit[1];
            let topicAction = topicSplit[2];
            let strMsg = message.payloadString;

            let msgObj = null;
            if (strMsg && strMsg.length > 0) {
              msgObj = JSON.parse(strMsg);
            } else {
              msgObj = {};
            }

            if (topicAction.indexOf('/') >= 0) {
              let topicActionSplit = topicAction.match('(.*?)/(.*)');
              msgObj.type = topicActionSplit[1];
            } else {
              msgObj.type = topicAction;
            }

            if (subscribeCallbacks['devices/' + deviceId + '/#'] && typeof subscribeCallbacks['devices/' + deviceId + '/#'] === 'function') {
              subscribeCallbacks['devices/' + deviceId + '/#'](msgObj);
            }

            if (subscribeCallbacks[topic] && typeof subscribeCallbacks[topic] === 'function') {
              subscribeCallbacks[topic](msgObj);
            }

            if (topicAction.indexOf('events') === 0 &&
                    typeof subscribeCallbacks['devices/' + deviceId + '/events/+'] === 'function') {
              subscribeCallbacks['devices/' + deviceId + '/events/+'](msgObj);
            } else if (topicAction.indexOf('logs') === 0 &&
                    typeof subscribeCallbacks['devices/' + deviceId + '/logs/+'] === 'function') {
              subscribeCallbacks['devices/' + deviceId + '/logs/+'](msgObj);
            } else if (topicAction.indexOf('locations') === 0 &&
                    typeof subscribeCallbacks['devices/' + deviceId + '/locations/+'] === 'function') {
              subscribeCallbacks['devices/' + deviceId + '/locations/+'](msgObj);
            } else if (topicAction.indexOf('sensors') === 0 &&
                    typeof subscribeCallbacks['devices/' + deviceId + '/sensors/+'] === 'function') {
              subscribeCallbacks['devices/' + deviceId + '/sensors/+'](msgObj);
            } else if (topicAction.indexOf('commands') === 0) {
              exec(msgObj.command, function (err, stdout, stderr) {
                if (err) {
                  console.log(err);
                }
                if (stdout) {
                  console.log(stdout);
                }
                if (stderr) {
                  console.log(stderr);
                }
              });
            }
          }
        }
      } catch(e) {
        console.log(e);
      }
    };

    mqttClient.onMessageDelivered = function (message) {
      if (Wia.stream.onMessageDelivered) {
        Wia.stream.onMessageDelivered(message);
      }
    };
  };

  Wia.stream.connect = function (opt) {
    if (!opt) {
      opt = {}; // eslint-disable-line no-param-reassign
    }
    console.log(Wia.streamApi);

    if (Wia.secretKey || Wia.appKey) {
      mqttClient.connect({
        timeout: Wia.streamApi.streamTimeout,
        userName: Wia.secretKey || Wia.appKey,
        password: ' ',
        useSSL: Wia.streamApi.useSecure,
        onSuccess: function () {
          Wia.stream.connected = true;
          if (opt && opt.onSuccess) {
            opt.onSuccess();
          }
        },
        onFailure: function (err) {
          Wia.stream.connected = false;
          if (opt && opt.onFailure) {
            opt.onFailure(err);
          }
        }
      });
    } else {
      Wia.stream.connected = false;
    }
  };

  Wia.stream.disconnect = function () {
    Wia.stream.connected = false;
    mqttClient.disconnect();
  };

  Wia.stream.subscribe = function (topic, cb) {
    subscribeCallbacks[topic] = cb;
    if (Wia.stream.connected) {
      mqttClient.subscribe(topic, {
        qos: 0
      });
    }
  };

  Wia.stream.unsubscribe = function (topic) {
    delete subscribeCallbacks[topic];
    if (Wia.stream.connected) {
      mqttClient.unsubscribe(topic);
    }
  };

  Wia.stream.unsubscribeAll = function () {
    for (let topic in subscribeCallbacks) {
      if (subscribeCallbacks.hasOwnProperty(topic)) {
        if (Wia.stream.connected) {
          mqttClient.unsubscribe(topic);
        }
        delete subscribeCallbacks[topic];
      }
    }
  };

  Wia.stream.publish = function (topic, data) {
    let message = new Paho.MQTT.Message(data);
    message.destinationName = topic;
    mqttClient.send(message);
  };
}(this));
