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

  $scope.showCard = $scope.passwordReset = false;
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

    //verify passwords match
    if (!$scope.update.password ||
      !$scope.update.confirmPassword ||
      $scope.update.password !== $scope.update.confirmPassword) {
       //throw some error front end won't let it happen
    }
    else {
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
    }

  };


})


;
