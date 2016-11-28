angular.module( 'diary.feed', [
  'ui.router',
  'pascalprecht.translate',
  'ui.bootstrap.showErrors',
  'bootstrapLightbox',
  'ngAnimate',
  'angularMoment'
])


.config(function config( $stateProvider, showErrorsConfigProvider ) {

  $stateProvider.state( 'diary.feed', {
    url: '/feed',
    views: {
      "diary": {
        controller: 'DiaryFeedCtrl',
        templateUrl: 'diary/feed/feed.tpl.html'
      }
    },
    data:{ pageTitle: 'Diary Feed' }
  });

  showErrorsConfigProvider.showSuccess(true);

})


.controller('DiaryFeedCtrl', function DiaryFeedCtrl( $scope, $rootScope, $filter, $translate, $timeout, $q, Lightbox, User, DiaryFeedService ) {
  'use strict';


  $scope.showCard = false;
  $scope.loggedIn = User.isAuthenticated();
  $scope.userId = User.getCurrentId();

  var languageId = '';


  $rootScope.$on('$translateChangeSuccess', function () {
    $scope.showCard = false;

    languageId = $rootScope.languageId;
    DiaryFeedService.getDiaryFeed(languageId)
      .then(function(diaryFeed){
        $scope.diaryFeed = diaryFeed;

        $timeout(function () {
          $scope.showCard = true;
        }, 100);
      });
  });

  languageId = $rootScope.languageId;
  if (languageId !== undefined) {
    DiaryFeedService.getDiaryFeed(languageId)
      .then(function(diaryFeed){
        $scope.diaryFeed = diaryFeed;

        $timeout(function () {
          $scope.showCard = true;
        }, 100);
      });

  }



    $scope.openLightboxModal = function (index, images) {
      Lightbox.openModal(images, index);
    };



  }) // end controller


.service('DiaryFeedService', function DiaryFeedService( $q, Diary, envService ) {




  this.getDiaryFeed = function(languageId) {
    var googlePlusAPI = envService.read('googlePlusAPI');

    var deferred = $q.defer();

    Diary.getDiaryFeed({languageId: languageId})
      .$promise.then(function (cb) {
        addGoogleAPIKeyRecursive(cb.diaryFeed, googlePlusAPI);
        deferred.resolve(cb.diaryFeed);
    });
    return deferred.promise;
  };


  function addGoogleAPIKeyRecursive(obj, googlePlusAPI)
  {
    for (var k in obj)
    {
      if (typeof obj[k] == "object" && obj[k] !== null) {
        addGoogleAPIKeyRecursive(obj[k], googlePlusAPI);
      }
      else {
        if (k==='profilePicture' && obj[k].indexOf('googleusercontent') > 0) {
        obj[k] += '&key='+ googlePlusAPI;
        }
      }
    }
  }


})


;
