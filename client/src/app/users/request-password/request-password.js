angular.module( 'users.requestPassword', [
  'ui.router',
  'lbServices',
  'ui.bootstrap.showErrors'
])

.config(function config( $stateProvider, showErrorsConfigProvider  ) {
  $stateProvider.state( 'users.requestPassword', {
    url: '/request-password',
    views: {
      "users": {
        controller: 'RequestPasswordCtrl',
        templateUrl: 'users/request-password/request-password.tpl.html'
      }
    },
    data:{ pageTitle: 'Request Password' }
  });

    showErrorsConfigProvider.showSuccess(true);

})


.controller('RequestPasswordCtrl', function RequestPasswordCtrl($scope, $timeout, User) {

  $scope.showCard = $scope.emailSent =false;
  $timeout(function(){
    $scope.showCard = true;
  },100);

  $scope.email = "";


  $scope.requestPassword = function() {

    User.resetPassword({
      email: $scope.email
    }, function() {
        $scope.emailSent = true;
    });
  };


})


;
