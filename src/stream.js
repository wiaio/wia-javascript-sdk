/*
*  This provides the ability to communicate with Wia's Stream API
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
    Wia.stream = Wia.stream || {};

    Wia.stream.connected = false;

    var subscribeCallbacks = {};

    var mqttClient = new Paho.MQTT.Client(Wia.streamApi.host, 3000, "/", "");

    mqttClient.onConnectionLost = function(response) {
      Wia.stream.connected = false;
      if (Wia.stream.onConnectionLost) {
        Wia.stream.onConnectionLost(response);
      }

      setTimeout(function() {
        console.log("Attempting reconnect...");
        mqttClient.connect({
          onSuccess: function() {
            console.log("Reconnected.");
            for (var topic in subscribeCallbacks) {
              if (subscribeCallbacks.hasOwnProperty(topic)) {
                mqttClient.subscribe(topic);
              }
            }
          },
          onFailure: function() {
            console.log("Could not reconnect.");
          }
        }, Wia.streamApi.connectTimeout);
      });
    };

    mqttClient.onMessageArrived = function(message) {
      var topic = message.destinationName;

      try {
        if (topic.indexOf('devices') === 0) {
          var topicSplit = topic.match("devices/(.*?)/(.*)");
          if (topicSplit) {
            var deviceId = topicSplit[1];
            var topicAction = topicSplit[2];
            var strMsg = message.payloadString;

            var msgObj = null;
            if (strMsg && strMsg.length > 0) {
              msgObj = JSON.parse(strMsg);
            } else {
              msgObj = {};
            }

            if (topicAction.indexOf('/') >= 0) {
              var topicActionSplit = topicAction.match("(.*?)/(.*)");
              msgObj.type = topicActionSplit[1];
            } else {
              msgObj.type = topicAction;
            }

            if (subscribeCallbacks["devices/" + deviceId + "/#"] && typeof subscribeCallbacks["devices/" + deviceId + "/#"] === "function") {
              subscribeCallbacks["devices/" + deviceId + "/#"](msgObj);
            }

            if (subscribeCallbacks[topic] && typeof subscribeCallbacks[topic] === "function") {
              subscribeCallbacks[topic](msgObj);
            }

            if (topicAction.indexOf("events") == 0 &&
                  typeof subscribeCallbacks["devices/" + deviceId + "/events/+"] === "function") {
              subscribeCallbacks["devices/" + deviceId + "/events/+"](msgObj);
            } else if (topicAction.indexOf("logs") == 0 &&
                  typeof subscribeCallbacks["devices/" + deviceId + "/logs/+"] === "function") {
              subscribeCallbacks["devices/" + deviceId + "/logs/+"](msgObj);
            } else if (topicAction.indexOf("locations") == 0 &&
                  typeof subscribeCallbacks["devices/" + deviceId + "/locations/+"] === "function") {
              subscribeCallbacks["devices/" + deviceId + "/locations/+"](msgObj);
            } else if (topicAction.indexOf("sensors") == 0 &&
                  typeof subscribeCallbacks["devices/" + deviceId + "/sensors/+"] === "function") {
              subscribeCallbacks["devices/" + deviceId + "/sensors/+"](msgObj);
            } else if (topicAction.indexOf("commands") == 0) {
              exec(msgObj.command, function(err, stdout, stderr) {
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

    mqttClient.onMessageDelivered = function(message) {
      if (Wia.stream.onMessageDelivered) {
        Wia.stream.onMessageDelivered(message);
      }
    };

    Wia.stream.connect = function(opt) {
      if (!opt) {
        opt = {};
      }

      mqttClient.connect({
        timeout: Wia.streamApi.streamTimeout,
        userName: Wia.secretKey || Wia.appKey,
        password: " ",
        useSSL: Wia.streamApi.useSecure,
        onSuccess: function() {
          Wia.stream.connected = true;
          if (opt && opt.onSuccess) {
            opt.onSuccess();
          }
        },
        onFailure: function(err) {
          Wia.stream.connected = false;
          if (opt && opt.onFailure) {
            opt.onFailure(err);
          }
        }
      });
    };

    Wia.stream.disconnect = function() {
      Wia.stream.connected = false;
      mqttClient.disconnect();
    };

    Wia.stream.subscribe = function(topic, cb) {
      subscribeCallbacks[topic] = cb;
      if (Wia.stream.connected) {
        mqttClient.subscribe(topic, {
          qos: 0
        });
      }
    };

    Wia.stream.unsubscribe = function(topic, cb) {
      delete subscribeCallbacks[topic];
      if (Wia.stream.connected) {
        mqttClient.unsubscribe(topic);
      }
    };

    Wia.stream.unsubscribeAll = function(topic, cb) {
      for (var topic in subscribeCallbacks) {
        if (subscribeCallbacks.hasOwnProperty(topic)) {
          if (Wia.stream.connected) {
            mqttClient.unsubscribe(topic);
          }
          delete subscribeCallbacks[topic];
        }
      }
    };

    Wia.stream.publish = function(topic, data, cb) {
      var message = new Paho.MQTT.Message(data);
      message.destinationName = topic;
      mqttClient.send(message);
    };
}(this));
