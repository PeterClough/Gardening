
angular.module( 'myApp.home', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', function( $scope, $timeout, User ) {
    $scope.loggedIn = User.isAuthenticated();
    console.log("homectrl"+$scope.loggedIn);
    $scope.showCard = false;
    $timeout(function(){
      $scope.showCard = true;
    },100);

})

;

