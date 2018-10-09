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

}(this));
