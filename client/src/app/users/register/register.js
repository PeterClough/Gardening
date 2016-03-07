angular.module( 'users.register', [
  'ui.router',
  'lbServices',
  'angular-growl',
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


.controller('RegisterCtrl', function RegisterCtrl($scope, $timeout, growl, User) {


    $scope.showCard = $scope.emailValidate = $scope.confirmValidate = $scope.passwordValidate = false;
    $timeout(function(){
      $scope.showCard = true;
    },100);

    $scope.registration = {};


    $scope.register = function() {

      $scope.$broadcast('show-errors-check-validity');

      if ($scope.registerForm.$invalid) {
        return;
      }


      User.save($scope.registration,
          function() {
            $scope.showCard = false;
            $scope.showVerify = true;
          },
          function(res) {
            if (res.data.error.details.codes.email[0] === 'uniqueness') {
              growl.error("GROWL_REGISTER_EMAIL", {title: "GROWL_REGISTER_EMAIL_TITLE"});
            }
          }
      );

    };
})



.directive('pwCheck', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      var firstPassword = '#' + attrs.pwCheck;
      elem.add(firstPassword).on('keyup', function () {
        scope.$apply(function () {
          var v = elem.val()===$(firstPassword).val();
          ctrl.$setValidity('pwmatch', v);
        });
      });
    }
  };
}])


.directive('complexPassword', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(password) {
        var hasUpperCase = /[A-Z]/.test(password);
        var hasNumbers = /\d/.test(password);

        if ((password.length >= 8) && hasUpperCase && hasNumbers){
          ctrl.$setValidity('complexity', true);
          return password;
        }
        else {
          ctrl.$setValidity('complexity', false);
          return undefined;
        }

      });
    }
  };
})



;
