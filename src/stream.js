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

    var subscribeCallbacks = {};

    var mqttClient = new Paho.MQTT.Client('api.wia.io', 3001, "/", "");

    mqttClient.onConnectionLost = function(response) {
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
                if (err) console.log(err);
                if (stdout) console.log(stdout);
                if (stderr) console.log(stderr);
              });
            }
          }
        }
      } catch(e) {
        console.log(e);
      }
    };

    /**
     * @namespace Provides an interface to Wia's Rest API
     */
    Wia.stream = Wia.stream || {};

    Wia.stream.connect = function(opt) {
      mqttClient.connect({
        timeout: 15,
        userName: Wia.secretKey,
        password: " ",
        useSSL: true,
        onSuccess: function() {
          console.log("onSuccess");
          if (opt && opt.onSuccess) {
            opt.onSuccess();
          }
        },
        onFailure: function(err) {
          console.log("onFailure");
          if (opt && opt.onFailure) {
            opt.onFailure(err);
          }
        }
      });
    };

    Wia.stream.disconnect = function() {
      mqttClient.disconnect();
    }

    Wia.stream.subscribe = function(topic, cb) {
      subscribeCallbacks[topic] = cb;
      mqttClient.subscribe(topic);
    }

    Wia.stream.unsubscribe = function(topic, cb) {
      delete subscribeCallbacks[topic];
      mqttClient.unsubscribe(topic);
    }
}(this));
