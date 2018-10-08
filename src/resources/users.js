/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */
(function (root) {
  root.Wia = root.Wia || {};
  let Wia = root.Wia;

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
}(this));
