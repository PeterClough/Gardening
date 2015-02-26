angular.module( 'users.register', [
  'ui.router',
  'lbServices'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'users.register', {
    url: '/register',
    views: {
      "users": {
        controller: 'RegisterCtrl',
        templateUrl: 'users/register/register.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });
})


.controller('RegisterCtrl', function RegisterCtrl($scope, $timeout, $location, User) {

  $scope.showCard = false;
  $timeout(function(){
    $scope.showCard = true;
  },100);

  $scope.registration = {};


  $scope.register = function() {
    $scope.user = User.save($scope.registration,
        function() {
          var next = $location.nextAfterLogin || '/users/login';
          $location.nextAfterLogin = null;
          $location.path(next);        // success
        },
        function(res) {
          $scope.registerError = res.data.error;
        }
    );
  };
})


;
