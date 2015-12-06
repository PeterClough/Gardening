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
console.log ("userid="+$scope.userId);





  if ($scope.loggedIn) {
    Diary.findByUserId({"userId":$scope.userId})
      .$promise.then(function(cb) {
        if (cb.diary.length===0){
          $scope.diary= {
            "created": Date.now(),
            "userId": $scope.userId,
            "id": $scope.userId,
            "isPrivate": false
          };
        }
        else{
          $scope.diary = cb.diary[0];
        }
        console.log("$scope.diary:");
        console.log($scope.diary);
        $timeout(function(){
          $scope.showCard = true;
        },100);
      });
  }

  $scope.save = function() {
    $scope.diary.updated= Date.now();

    console.log("$scope.diary:");
    console.log($scope.diary);
    $scope.createResult = Diary.upsert($scope.diary, function () {

      var next = $location.nextAfterCreate || '/diary/defaults';
      $location.nextAfterCreate = null;
      $location.path(next);

    },
    function (res) {
      $scope.createError = res.data.error;
      console.log("error="+$scope.createError);
      if ($scope.createError.code == 11000) {
        $scope.messages = 'You already have a diary. Click on the diary in the menu to view.';
      }


    });
  };
})

;
