/*
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
    Wia.customers = Wia.customers || {};

    Wia.customers.retrieve = function(customerId, success, failure) {
      Wia._restClient._get('customers/' + customerId, {}, function(customer) {
        success(customer);
      }, function(response) {
        failure(response);
      });
    };

    Wia.customers.signup = function(data, success, failure) {
      Wia._restClient._post('customers/signup', data, function(customer) {
        success(customer);
      }, function(response) {
        failure(response);
      });
    };

    Wia.customers.login = function(data, success, failure) {
      data.scope = "customer";
      data.grantType = "password";

      Wia._restClient._post('auth/token', data, function(accessToken) {
        Wia.accessToken = accessToken.accessToken;
        success(accessToken);
      }, function(response) {
        failure(response);
      });
    };
}(this));
