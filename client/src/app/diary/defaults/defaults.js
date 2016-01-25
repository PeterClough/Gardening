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


.controller( 'diaryDefaultCtrl', function diaryDefaultCtrl($scope, User, Diary, DiaryDefault, Country, HardinessZone, SoilAcidity, SoilType, $location, $translate) {

  $scope.showCard = false;

  $scope.diaryDefault={};
  $scope.loggedIn = User.isAuthenticated();
  $scope.userId = User.getCurrentId();



    Country.getList()
      .$promise.then(function(cb) {
        $scope.countries = cb.countries;
        $scope.country = {};
      });

    HardinessZone.getList()
      .$promise.then(function(cb) {
        $scope.hardinessZones = cb.hardinessZones;
        $scope.hardinessZone = {};
      });

    SoilAcidity.getList()
      .$promise.then(function(cb) {
        $scope.soilAcidities = cb.soilAcidities;
        $scope.soilAcidity = {};
      });

    SoilType.getList()
      .$promise.then(function(cb) {
        $scope.soilTypes = cb.soilTypes;
        $scope.soilType = {};
      });




    Diary.find($scope.userId)
      .$promise.then(function(cb) {
        $scope.diaryId = cb.diaryId;
      });


    DiaryDefault.findByDiaryId({"diaryId": $scope.userId})
      .$promise.then(function(cb) {
          if (cb.diaryDefault.length===0){
            $scope.diaryDefault ={};
          }
          else {
            $scope.diaryDefault = cb.diaryDefault[0];
          }
        $scope.showCard = true;
      });

  $scope.save = function() {

    $scope.$broadcast('show-errors-check-validity');

    if ($scope.defaultForm.$valid) {

      $scope.diaryDefault.diaryId = $scope.userId;
      $scope.diaryDefault.id = $scope.userId;
      $scope.diaryDefault.updated = Date.now();

      $scope.defaultsResult = DiaryDefault.upsert($scope.diaryDefault, function () {

        var next = $location.nextAfterDefaults || '/diary/view';
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


})



;
