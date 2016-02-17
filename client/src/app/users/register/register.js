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


    $scope.showCard = $scope.emailValidate = $scope.confirmValidate = false;
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



.directive('match', function ($parse) {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elem, attrs, ctrl) {
//This part does the matching
      scope.$watch(function() {
        return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || $parse(attrs.match)(scope) === ctrl.$modelValue;
      }, function(currentValue) {
        ctrl.$setValidity('match', currentValue);
      });

//This part is supposed to check the strength
      ctrl.$parsers.unshift(function(viewValue) {
        var pwdValidLength, pwdHasLetter, pwdHasNumber;

        pwdValidLength = (viewValue && viewValue.length >= 8 ? true : false);
        pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? true : false;
        pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? true : false;

        if( pwdValidLength && pwdHasLetter && pwdHasNumber ) {
          ctrl.$setValidity('pwd', true);
        } else {
          ctrl.$setValidity('pwd', false);
        }
        return viewValue;
      });
    },
  };
})

;
