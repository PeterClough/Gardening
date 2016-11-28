angular.module( 'admin.wiki.list', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'admin.wiki.list', {
    url: '/list',
    views: {
      "wiki": {
        controller: 'ListCtrl',
        templateUrl: 'admin/wiki/list/list.tpl.html'
      }
    },
    data:{ pageTitle: 'Wiki List Admin' }
  });
})

.controller( 'ListCtrl', function ListCtrl( $scope, $rootScope, $translate, $timeout, User, UserService, AdminWikiService) {


  $scope.showCard = false;
  $scope.canReview = true;
  $scope.nothingToReview = false;
  $scope.loggedIn = User.isAuthenticated();
  var userId = User.getCurrentId();
  var languageId = '';
  $scope.saveSuccess = false;


  UserService.checkRoles($scope.userId, ['admin', 'editor'])
    .then(function(cb) {
      $scope.canReview = cb.length > 0 ? true : false;

    });




  if (typeof languageId != 'undefined') {
    languageId = $rootScope.languageId;

    AdminWikiService.getPlantFamilyReviewList(languageId)
      .then(function (cb) {
        $scope.plantFamilyReviews = cb;
        $scope.nothingToReview = !somethingToReview(cb);
        $timeout(function () {
          $scope.showCard = true;
        }, 100);

      });

  }







  $rootScope.$on('$translateChangeSuccess', function () {
    $scope.showCard = false;
    languageId = $rootScope.languageId;

    AdminWikiService.getPlantFamilyReviewList(languageId)
      .then(function (cb) {
        $scope.plantFamilyReviews = cb;
        $scope.nothingToReview = !somethingToReview(cb);
        $timeout(function () {
          $scope.showCard = true;
        }, 100);

      });
  });






  var somethingToReview = function (reviews){

    var reviewsExist = false;

    angular.forEach(reviews, function (value) {
      if (value.plantFamilyVersion.length > 0){
        reviewsExist = true;
      }
    });

    return reviewsExist;

  };


})

;
