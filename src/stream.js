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

    var STREAM_TIMEOUT = 15;

    Wia.stream.connected = false;

    var subscribeCallbacks = {};

    var mqttClient = new Paho.MQTT.Client(Wia.socketApiHost, Wia.socketApiPort, "/", "");

    mqttClient.onConnectionLost = function(response) {
      Wia.stream.connected = false;
      if (Wia.stream.onConnectionLost) {
        Wia.stream.onConnectionLost(response);
      }
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
      mqttClient.connect({
        timeout: STREAM_TIMEOUT,
        userName: Wia.secretKey || Wia.appKey,
        password: " ",
        useSSL: opt.useSSL || true,
        onSuccess: function() {
          Wia.stream.connected = true;
          console.log("onSuccess");
          if (opt && opt.onSuccess) {
            opt.onSuccess();
          }
        },
        onFailure: function(err) {
          Wia.stream.connected = false;
          console.log("onFailure");
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
      mqttClient.subscribe(topic, {
        qos: 0
      });
    };

    Wia.stream.unsubscribe = function(topic, cb) {
      delete subscribeCallbacks[topic];
      mqttClient.unsubscribe(topic);
    };

    Wia.stream.publish = function(topic, data, cb) {
      var message = new Paho.MQTT.Message(data);
      message.destinationName = topic;
      mqttClient.publish(message);
    };
}(this));
