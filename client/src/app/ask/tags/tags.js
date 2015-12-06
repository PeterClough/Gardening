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

.controller( 'AskTagsCtrl', function AskTagsCtrl( $scope, $translate, $filter, $timeout, Tag ) {


    console.log("in tag ctrl");
    $scope.showCard = false;



  Tag.getAllTags()
      .$promise.then(function (cb) {
        console.log("getAllTags success", cb);
        $scope.allTags = cb.allTags;

        $timeout(function(){
          $scope.showCard = true;
        },100);

      });



})

;
