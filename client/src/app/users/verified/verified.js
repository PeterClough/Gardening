angular.module( 'users.verified', [
  'ui.router',
  'lbServices',
  'ui.bootstrap.showErrors',
  'pascalprecht.translate'
])

.config(function config( $stateProvider, showErrorsConfigProvider ) {
  $stateProvider.state( 'users.verified', {
    url: '/verified',
    views: {
      "users": {
        controller: 'VerifiedCtrl',
        templateUrl: 'users/verified/verified.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });

    showErrorsConfigProvider.showSuccess(true);

})

.controller('VerifiedCtrl', function VerifiedCtrl($scope, $timeout) {

  $scope.showCard = false;
  $timeout(function(){
    $scope.showCard = true;
  },100);



})


;
