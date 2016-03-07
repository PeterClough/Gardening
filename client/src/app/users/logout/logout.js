angular.module( 'users.logout', [
  'ui.router',
  'lbServices',
  'ui.bootstrap.showErrors',
  'angular-growl',
  'pascalprecht.translate'
])

.config(function config( $stateProvider, showErrorsConfigProvider ) {
  $stateProvider.state( 'users.logout', {
    url: '/logout',
    views: {
      "users": {
        controller: 'LogoutCtrl',
        templateUrl: 'users/logout/logout.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });

    showErrorsConfigProvider.showSuccess(true);

})

.controller('LogoutCtrl', function LogoutCtrl($scope, $timeout, User, LoopBackAuth, $translate, growl) {

  $scope.showCard = false;



  if (User.isAuthenticated()) {
    User.logout()
      .$promise
      .then(function(res) {
        $timeout(function(){
          $scope.showCard = true;
        },100);
      })
      .catch(function (err) {
        console.log('err', err);
        LoopBackAuth.clearUser();
        LoopBackAuth.save();
        localStorage.clear();
        $timeout(function(){
          $scope.showCard = true;
        },100);
      });
  }
  else {
    growl.info("LOGOUT_ALREADY", {title: "GROWL_LOGOUT_TITLE"});
  }


})


;
