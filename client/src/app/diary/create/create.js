angular.module( 'diary.create', [
  'ui.router',
  'pascalprecht.translate'
])


.config(function config( $stateProvider ) {

  $stateProvider.state( 'diary.create', {
    url: '/create',
    views: {
      "diary": {
        controller: 'DiaryCreateCtrl',
        templateUrl: 'diary/create/create.tpl.html'
      }
    },
    data:{ pageTitle: 'Create Diary' }
  });
})


.controller( 'DiaryCreateCtrl', function DiaryCreateCtrl($scope, User, Diary, DiaryDefault, $location, $timeout) {

  $scope.showCard = false;

  $scope.diary={};
  $scope.loggedIn = User.isAuthenticated();
  $scope.userId = User.getCurrentId();

    if ($scope.loggedIn) {
    Diary.findByUserId({"userId":$scope.userId})
      .$promise.then(function(cb) {
        if (cb.diary.length===0){
          $scope.diary= {
            "isPrivate": false
          };
        }
        else{
          $scope.diary = cb.diary[0];
        }
        $timeout(function(){
          $scope.showCard = true;
        },100);
      });
  }

  $scope.save = function() {

    if ($scope.diary.created === undefined) {
      $scope.diary.created = Date.now();
      $scope.diary.userId = $scope.userId;
      $scope.diary.id = $scope.userId;
      $scope.diary.languageId = $scope.$parent.$parent.language.selected.id;
    }

    $scope.diary.updated= Date.now();





    $scope.createResult = Diary.upsert($scope.diary, function () {
      var next = $location.nextAfterCreate || '/diary/defaults';
      $location.nextAfterCreate = null;
      $location.path(next);
    },
    function (res) {
      $scope.createError = res.data.error;
      if ($scope.createError.code == 11000) {
        $scope.messages = 'You already have a diary. Click on the diary in the menu to view.';
      }
   });
  };
})

;
