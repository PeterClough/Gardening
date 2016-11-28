angular.module( 'admin.wiki.review', [
    'ui.router',
    'ui.bootstrap.showErrors',
    'angular-growl'
  ])

.config(function config( $stateProvider ) {

  $stateProvider.state( 'admin.wiki.review', {
    url: '/review/:id',
    views: {
      "wiki": {
        controller: 'WikiReviewCtrl',
        templateUrl: 'admin/wiki/review/review.tpl.html'
      }
    },
    params: {
      id  : {
        value : ''
      }
    },
    data:{ pageTitle: 'Review Wiki' }
  });
})

.controller( 'WikiReviewCtrl', function WikiReviewCtrl( $scope, $timeout, $translate, $stateParams, User, UserService, AdminWikiService ) {



  $scope.showCard = false;
  $scope.loggedIn = User.isAuthenticated();
  $scope.canReview = true;
  $scope.noCurrentVersion = false;
  $scope.alreadyReviewed = false;
  $scope.reviewAccepted = false;
  $scope.reviewRejected = false;


  var userId = User.getCurrentId();
  var languageId = '';

  UserService.checkRoles($scope.userId, ['admin', 'editor'])
    .then(function(cb) {
      $scope.canReview = cb.length > 0 ? true : false;

    });



  if ($stateParams.id !== undefined) {

    AdminWikiService.getPlantFamilyVersionReview($stateParams.id)
      .then(function (cb) {
        $scope.plantFamily = cb;
        $scope.reviewPlantFamilyVersion = cb[0];



        if ($scope.reviewPlantFamilyVersion.state !==0){
          $scope.alreadyReviewed = true;
        }



        if (typeof $scope.reviewPlantFamilyVersion.plantFamily.plantFamilyVersion[0] !== "undefined"){
          $scope.currentPlantFamilyVersion = $scope.reviewPlantFamilyVersion.plantFamily.plantFamilyVersion[0];
        }
        else {
          $scope.currentPlantFamilyVersion = '';
          $scope.noCurrentVersion = true;
        }

        $scope.plantFamilyName = $scope.reviewPlantFamilyVersion.plantFamily.name;
        delete $scope.reviewPlantFamilyVersion.plantFamily;

        $timeout(function () {
          $scope.showCard = true;
        }, 100);

      });


    $scope.acceptReview = function() {


      var currentId =  $scope.noCurrentVersion === false ? $scope.currentPlantFamilyVersion.id : '';


      AdminWikiService.acceptReview($scope.reviewPlantFamilyVersion, currentId)
        .then(function (cb) {
          $scope.reviewAccepted = true;
        });


    };


    $scope.rejectReview = function() {



      AdminWikiService.rejectReview($scope.reviewPlantFamilyVersion)
        .then(function (cb) {
          $scope.reviewRejected = true;
        });


    };



  }


})


;

