angular.module( 'myApp.diary', [
  'ui.router',
  'pascalprecht.translate',
  'diary.view',
  'diary.create',
  'diary.defaults',
  'diary.feed'
])


.config(function config( $stateProvider ) {

  $stateProvider.state( 'diary', {
    url: '/diary',
    views: {
      "main": {
        controller: 'DiaryCtrl',
        templateUrl: 'diary/diary.tpl.html'
      }
    },
    data:{ pageTitle: 'Diary' }
  });
})

.controller( 'DiaryCtrl', function DiaryCtrl() {


})

;
