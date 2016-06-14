angular.module( 'diary.defaults', [
  'ui.router',
  'pascalprecht.translate',
  'ui.bootstrap.showErrors'
])


.config(function config( $stateProvider, showErrorsConfigProvider ) {

  $stateProvider.state( 'diary.defaults', {
    url: '/defaults',
    views: {
      "diary": {
        controller: 'diaryDefaultCtrl',
        templateUrl: 'diary/defaults/defaults.tpl.html'
      }
    },
    data:{ pageTitle: 'Diary defaults' }
  });

  showErrorsConfigProvider.showSuccess(true);


})


.controller( 'diaryDefaultCtrl', function diaryDefaultCtrl($scope, $rootScope, User, DiaryService, DiaryDefault, Country, HardinessZone, SoilAcidity, SoilType, $location, $translate) {

  $scope.showCard = false;

  $scope.diaryDefault={};
  $scope.loggedIn = User.isAuthenticated();
  $scope.userId = User.getCurrentId();

  getDiaryData();











    DiaryDefault.findByDiaryId({"diaryId": $scope.userId})
    .$promise.then(function(cb) {
        if (cb.diaryDefault.length===0){
          $scope.diaryDefault ={isPrivate: false};
        }
        else {
          $scope.diaryDefault = cb.diaryDefault[0];
        }
      $scope.showCard = true;
    });

  $scope.save = function() {

    $scope.$broadcast('show-errors-check-validity');

    if ($scope.defaultForm.$valid) {
      if ($scope.diaryDefault.created === undefined) {
        $scope.diaryDefault.diaryId = $scope.userId;
        $scope.diaryDefault.id = $scope.userId;
        $scope.diaryDefault.created = Date.now();
      }

      $scope.diaryDefault.updated = Date.now();

      $scope.defaultsResult = DiaryDefault.upsert($scope.diaryDefault, function () {

        var next = $location.nextAfterDefaults || '/diary/edit';
        $location.nextAfterDefaults = null;
        $location.path(next);

      },
      function (res) {
        $scope.createError = res.data.error;
        if ($scope.createError.code == 11000) {
          $scope.messages = 'You already have a diary default. Click on the diary in the menu to view.';
        }
      });
    }
  };


  function getDiaryData() {


    DiaryService.getDiaryData()
      .then(function(cb){

        cb[0].promise.then(function(cb2) {
          $scope.countries = cb2;
          $scope.country = {};
        });

        cb[1].promise.then(function(cb2) {
          $scope.hardinessZones = cb2;
          $scope.hardinessZone = {};
        });

        cb[2].promise.then(function(cb2) {
          $scope.soilAcidities = cb2;
          $scope.soilAcidity = {};
        });

        cb[3].promise.then(function(cb2) {
          $scope.soilTypes = cb2;
          $scope.soilType = {};
        });


      });
  }




})



;
