angular.module( 'users.login', [
  'ui.router',
  'lbServices',
  'ui.bootstrap.showErrors',
  'pascalprecht.translate'
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

.controller('LoginCtrl', function LoginCtrl($scope, $timeout, User, $location, $translate) {

  $scope.showCard = false;
  $timeout(function(){
    $scope.showCard = true;
  },100);


  $scope.login = function () {
    $scope.loginResult = User.login({include: 'user', rememberMe: true}, $scope.credentials,
        function () {
          var next = $location.nextAfterLogin || '/';
          $location.nextAfterLogin = null;
          $location.path(next);
        },
        function (res) {
          $scope.loginError = res.data.error;
         switch (res.data.error.message) {
            case "login failed as the email has not been verified" :
              $translate('LOGIN_FAILED_EMAIL_NOT_VERIFIED').then(function (text) {
                $scope.loginErrorMessage = text;
              });
              break;
            case "login failed" :
              $translate('LOGIN_FAILED').then(function (text) {
                $scope.loginErrorMessage = text;
              });
              break;
            case "USERNAME_EMAIL_REQUIRED" :
            $translate('USERNAME_EMAIL_REQUIRED').then(function (text) {
              $scope.loginErrorMessage = text;
            });
            break;

            default:
              $translate('LOGIN_FAILED_OTHER').then(function (text) {
                $scope.loginErrorMessage = text;
              });
          }


    });
  };
})


;
