angular.module( 'ask.tags', [
  'ui.router',
  'pascalprecht.translate'
])


.config(function config( $stateProvider ) {

  $stateProvider.state( 'ask.tags', {
    url: '/tags',
    views: {
      "ask": {
        controller: 'AskTagsCtrl',
        templateUrl: 'ask/tags/tags.tpl.html'
      }
    },
    data:{ pageTitle: 'Tags' }
  });
})

.controller( 'AskTagsCtrl', function AskTagsCtrl( $rootScope, $scope, $translate, $filter, $timeout, Tag ) {

    $scope.showCard = false;




    $rootScope.$on('$translateChangeSuccess', function () {

      languageId = $rootScope.languageId;

      Tag.getAllTags({languageId: languageId})
        .$promise.then(function (cb) {
          $scope.allTags = cb.allTags;

          $timeout(function () {
            $scope.showCard = true;
          }, 100);

        });
    });



    languageId = $rootScope.languageId;

    Tag.getAllTags({languageId: languageId})
    .$promise.then(function (cb) {
      $scope.allTags = cb.allTags;

      $timeout(function () {
        $scope.showCard = true;
      }, 100);

    });



})

;
