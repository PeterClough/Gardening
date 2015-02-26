angular.module( 'myApp.users', [
  'ui.router',
  'users.login',
  'users.register'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'users', {
    url: '/users',
    views: {
      "main": {
        controller: 'UsersCtrl',
        templateUrl: 'users/users.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });
})

.controller( 'UsersCtrl', function UsersCtrl( ) {

})

;
