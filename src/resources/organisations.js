/*
*  @author Conall Laverty (team@wia.io)
*/

/**
 */
(function(root) {
    root.Wia = root.Wia || {};
    var Wia = root.Wia;

    /**
     * @namespace Provides an interface
     */
    Wia.organisations = Wia.organisations || {};

    Wia.organisations.retrieve = function(organisationId, success, failure) {
      Wia._restClient._get('organisations/' + organisationId, {}, function(organisation) {
        success(organisation);
      }, function(response) {
        failure(response);
      });
    };
}(this));
