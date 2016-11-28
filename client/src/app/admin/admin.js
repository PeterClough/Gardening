angular.module( 'myApp.admin', [
  'ui.router',
  'admin.wiki'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'admin', {
    url: '/admin',
    views: {
      "main": {
        controller: 'AdminCtrl',
        templateUrl: 'admin/admin.tpl.html'
      }
    },
    data:{ pageTitle: 'Admin' }
  });
})

.controller( 'AdminCtrl', function AdminCtrl( ) {

})

;
