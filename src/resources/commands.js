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
  Wia.commands = Wia.commands || {};

  // Wia.commands.subscribe = function (opt, callback) {
  //   if (!opt) {
  //     throw new Error('Options cannot be null');
  //   }
  //   if (typeof Wia.clientInfo !== 'undefined' && typeof Wia.clientInfo.id !== 'undefined') {
  //     Wia.stream.subscribe('devices/' + Wia.clientInfo.id + '/commands/' + opt.slug + '/run', callback);
  //   } else {
  //     setTimeout(function() {
  //       if (typeof Wia.clientInfo !== 'undefined' && typeof Wia.clientInfo.id !== 'undefined') {
  //         Wia.stream.subscribe('devices/' + Wia.clientInfo.id + '/commands/' + opt.slug + '/run', callback);
  //       }
  //     }, 5000);
  //   }
  // };

  Wia.commands.run = function(opt, success, failure) {
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
  }
}(this));