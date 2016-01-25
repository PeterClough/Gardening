angular.module( 'myApp.users', [
  'ui.router',
  'users.login',
  'users.register',
  'users.verified',
  'users.requestPassword',
  'users.resetPassword'
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
    data:{ pageTitle: 'Users' }
  });
})

.controller( 'UsersCtrl', function UsersCtrl( ) {

})

;
