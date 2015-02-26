angular.module( 'users.login', [
  'ui.router',
  'lbServices'
])

.config(function config( $stateProvider ) {
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
})

.controller('LoginCtrl', function LoginCtrl($scope, $timeout, User, $location) {

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
          console.log($scope.loginError);
        }
    );
  };
})


;
