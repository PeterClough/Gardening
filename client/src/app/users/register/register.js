angular.module( 'users.register', [
  'ui.router',
  'lbServices',
  'ui.bootstrap.showErrors'
])

.config(function config( $stateProvider, showErrorsConfigProvider  ) {
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

    showErrorsConfigProvider.showSuccess(true);

})


.controller('RegisterCtrl', function RegisterCtrl($scope, $timeout, User) {

  $scope.showCard = false;
  $timeout(function(){
    $scope.showCard = true;
  },100);

  $scope.registration = {};


  $scope.register = function() {
    User.save($scope.registration,
        function() {
          $scope.showCard = false;
          $scope.showVerify = true;
        },
        function(res) {
//          $scope.registerError = res.data.error;
        }
    );

  };
})




.directive("passwordVerify", function() {
  return {
    require: "ngModel",
    scope: {
      passwordVerify: '='
    },
    link: function(scope, element, attrs, ctrl) {
      scope.$watch(function() {
        var combined;

        if (scope.passwordVerify || ctrl.$viewValue) {
          combined = scope.passwordVerify + '_' + ctrl.$viewValue;
        }
        return combined;
      }, function(value) {
        if (value) {
          ctrl.$parsers.unshift(function(viewValue) {
            var origin = scope.passwordVerify;
            if (origin !== viewValue) {
              ctrl.$setValidity("passwordVerify", false);
              return undefined;
            } else {
              ctrl.$setValidity("passwordVerify", true);
              return viewValue;
            }
          });
        }
      });
    }
  };
})

;
