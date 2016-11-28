angular.module( 'users.login', [
  'ui.router',
  'lbServices',
  'ui.bootstrap.showErrors',
  'pascalprecht.translate',
  'satellizer'
])

.config(function config( $stateProvider, showErrorsConfigProvider ) {
  $stateProvider.state( 'users.login', {
    url: '/login',
    views: {
      "users": {
        controller: 'LoginCtrl',
        templateUrl: 'users/login/login.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });

    showErrorsConfigProvider.showSuccess(true);

})

.controller('LoginCtrl', function LoginCtrl($scope, $rootScope, $timeout, User, $location, $translate, $auth, growl, LoopBackAuth, UserService) {

    $scope.showCard = $scope.rememberMe = false;
   $timeout(function(){
    $scope.showCard = true;
  },100);




    $scope.authenticate = function (provider) {
      $auth.authenticate(provider)
        .then(function (response) {
          var accessToken = response.data;
          LoopBackAuth.setUser(accessToken.id, accessToken.userId, {id:accessToken.name});
          LoopBackAuth.rememberMe = true;
          LoopBackAuth.save();
          $location.path('/');
          growl.success('LOGIN_SUCCESS', {title: "GROWL_LOGIN_TITLE"});




          return response.resource;
        });
    };




    $scope.login = function () {

    $scope.$broadcast('show-errors-check-validity');

    if ($scope.loginForm.$invalid) {
      return;
    }

    User.login({include: 'user', rememberMe: $scope.rememberMe}, $scope.credentials,
        function () {
          $location.path('/');
          growl.success('LOGIN_SUCCESS', {title: "GROWL_LOGIN_TITLE"});

          $scope.userId = User.getCurrentId();
          UserService.checkRoles($scope.userId, ['admin'])
            .then(function(cb) {



              $rootScope.isAdmin = cb.length > 0 ? true : false;

            });

        },
        function (res) {
          switch (res.data.error.message) {
            case "login failed as the email has not been verified" :
              growl.error('LOGIN_FAILED_EMAIL_NOT_VERIFIED');
              break;
            case "login failed" :
              growl.error('LOGIN_FAILED');
              break;
            case "USERNAME_EMAIL_REQUIRED" :
              growl.error('USERNAME_EMAIL_REQUIRED');
              break;
            default:
              growl.error('LOGIN_FAILED_OTHER');
          }


    });
  };
})


;
