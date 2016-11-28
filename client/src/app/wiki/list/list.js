angular.module( 'wiki.list', [
    'ui.router',
    'pascalprecht.translate',
    'ui.bootstrap.showErrors',
    'angular-growl'
  ])

.config(function config( $stateProvider ) {

  $stateProvider.state( 'wiki.list', {
    url: '/list',
    views: {
      "wiki": {
        controller: 'WikiListCtrl',
        templateUrl: 'wiki/list/list.tpl.html'
      }
    },
    data:{ pageTitle: 'Wiki List' }
  });
})

.controller( 'WikiListCtrl', function WikiListCtrl( $scope, $rootScope, $timeout, $translate, WikiService ) {


  $scope.showCard = false;
  var languageId = '';


  $rootScope.$on('$translateChangeSuccess', function () {
    $scope.showCard = false;
    languageId = $rootScope.languageId;

    WikiService.getPlantFamilyList(languageId)
      .then(function(cb){
        $scope.plantFamilies = cb;
        $timeout(function () {
          $scope.showCard = true;
        }, 100);
      });
  });



  if (languageId !== undefined) {
    languageId = $rootScope.languageId;

    WikiService.getPlantFamilyList(languageId)
      .then(function (cb) {
        $scope.plantFamilies = cb;
        $timeout(function () {
          $scope.showCard = true;
        }, 100);
      });
  }




})


;

