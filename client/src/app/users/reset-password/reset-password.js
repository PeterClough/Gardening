angular.module( 'users.resetPassword', [
  'ui.router',
  'lbServices',
  'ui.bootstrap.showErrors'
])

.config(function config( $stateProvider, showErrorsConfigProvider  ) {
  $stateProvider.state( 'users.resetPassword', {
    url: '/reset-password/:token/:uid',
    views: {
      "users": {
        controller: 'ResetPasswordCtrl',
        templateUrl: 'users/reset-password/reset-password.tpl.html'
      }
    },
    params: {
      token  : {
        value : ''
      },
      uid  : {
        value : ''
      }

    },
    data:{ pageTitle: 'Reset Password' }
  });

    showErrorsConfigProvider.showSuccess(true);

})


.controller('ResetPasswordCtrl', function ResetPasswordCtrl($scope, $timeout, $stateParams, User, LoopBackAuth, AccessToken) {

  $scope.showCard = $scope.passwordReset = $scope.confirmValidate = $scope.passwordValidate = false;
  $timeout(function(){
    $scope.showCard = true;
  },100);

  $scope.email = "";


  if (!$stateParams.token || !$stateParams.uid) {
    //throw some error
  }
  else {
    LoopBackAuth.currentUserId = $stateParams.uid;
    LoopBackAuth.accessTokenId = $stateParams.token;
    LoopBackAuth.save();
  }

    $scope.resetPassword = function() {

    $scope.$broadcast('show-errors-check-validity');
    if ($scope.resetPasswordForm.$invalid) {
      return;
    }


    User.updateOrCreate({
      id: $stateParams.uid,
      password: $scope.update.password
    }).$promise
      .then(function () {
        LoopBackAuth.currentUserId = null;
        LoopBackAuth.accessTokenId = null;
        LoopBackAuth.save();

        $scope.passwordReset = true;
      });

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
