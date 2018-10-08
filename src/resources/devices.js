/*
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
    if (typeof data === 'object') {
      if (data.id) {
        Wia.stream.subscribe('devices/' + data.id + '/#', callback);
      }
    } else {
      Wia.stream.subscribe('devices/' + data + '/#', callback);
    }
  };

  Wia.devices.unsubscribe = function (data, callback) {
    if (typeof data === 'object') {
      if (data.id) {
        Wia.stream.unsubscribe('devices/' + data.id + '/#', callback);
      }
    } else {
      Wia.stream.unsubscribe('devices/' + data + '/#', callback);
    }
  };
}(this));
