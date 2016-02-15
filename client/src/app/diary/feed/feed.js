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


.controller('DiaryFeedCtrl', function DiaryFeedCtrl( $scope, $rootScope, $filter, $translate, $timeout, Lightbox, User, Diary ) {
  'use strict';


  $scope.showCard = false;
  $scope.loggedIn = User.isAuthenticated();
  $scope.userId = User.getCurrentId();

  var languageId = '';


  $rootScope.$on('$translateChangeSuccess', function () {
    $scope.showCard = false;

    languageId = $rootScope.languageId;

    Diary.getDiaryFeed({languageId: languageId})
      .$promise.then(function (cb) {
        $scope.diaryFeed = cb.diaryFeed;

        $scope.diaryFeed.forEach(function(df) {
          if (df.diaryEntryImageDocs !== undefined) {
            df.diaryEntryImageDocs.forEach(function(dEID){
              dEID.thumbUrl = "api/diaryEntryImages/thumbs/download/"+ dEID.id + dEID.extension;
              dEID.url = "api/diaryEntryImages/lightbox/download/"+ dEID.id + dEID.extension;
            });
          }
          if (df.diaryProgressImageDocs !== undefined) {
            df.diaryProgressImageDocs.forEach(function(dPID){
              dPID.thumbUrl = "api/diaryProgressImages/thumbs/download/"+ dPID.id + dPID.extension;
              dPID.url = "api/diaryProgressImages/lightbox/download/"+ dPID.id + dPID.extension;
            });
          }

          if (df.extension !== undefined && df.diaryEntryId !== undefined) {
            df.url = "api/diaryEntryImages/lightbox/download/"+ df.id + df.extension;
          }
          if (df.extension !== undefined && df.diaryProcessId !== undefined) {
            df.url = "api/diaryProcessImages/lightbox/download/"+ df.id + df.extension;
          }

        });
        $timeout(function () {
          $scope.showCard = true;
        }, 100);
      });
  });

  languageId = $rootScope.languageId;
  if (languageId !== undefined) {
    Diary.getDiaryFeed({languageId: languageId})
      .$promise.then(function (cb) {
        $scope.diaryFeed = cb.diaryFeed;

        $scope.diaryFeed.forEach(function (df) {
          if (df.diaryEntryImageDocs !== undefined) {
            df.diaryEntryImageDocs.forEach(function (dEID) {
              dEID.thumbUrl = "api/diaryEntryImages/thumbs/download/" + dEID.id + dEID.extension;
              dEID.url = "api/diaryEntryImages/lightbox/download/" + dEID.id + dEID.extension;
            });
          }
          if (df.diaryProgressImageDocs !== undefined) {
            df.diaryProgressImageDocs.forEach(function (dPID) {
              dPID.thumbUrl = "api/diaryProgressImages/thumbs/download/" + dPID.id + dPID.extension;
              dPID.url = "api/diaryProgressImages/lightbox/download/" + dPID.id + dPID.extension;
            });
          }

          if (df.extension !== undefined && df.diaryEntryId !== undefined) {
            df.url = "api/diaryEntryImages/lightbox/download/" + df.id + df.extension;
          }
          if (df.extension !== undefined && df.diaryProcessId !== undefined) {
            df.url = "api/diaryProcessImages/lightbox/download/" + df.id + df.extension;
          }

        });
        $timeout(function () {
          $scope.showCard = true;
        }, 100);

      });
  }



    $scope.openLightboxModal = function (index, images) {
      Lightbox.openModal(images, index);
    };


  }) // end controller



;



