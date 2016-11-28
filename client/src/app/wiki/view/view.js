angular.module( 'wiki.view', [
    'ui.router',
    'pascalprecht.translate',
    'ui.bootstrap.showErrors',
    'angular-growl'
  ])

.config(function config( $stateProvider ) {

  $stateProvider.state( 'wiki.view', {
    url: '/view/:name',
    views: {
      "wiki": {
        controller: 'WikiViewCtrl',
        templateUrl: 'wiki/view/view.tpl.html'
      }
    },
    params: {
      name  : {
        value : ''
      }
    },
    data:{ pageTitle: 'View Wiki' }
  });
})

.controller( 'WikiViewCtrl', function WikiViewCtrl( $scope, $timeout, $translate, $stateParams, User, WikiService ) {



  $scope.showCard = false;
  $scope.loggedIn = User.isAuthenticated();
  $scope.canEdit = true;

  var userId = User.getCurrentId();
  var languageId = '';


  User.getRoles({"userId":$scope.userId})
    .$promise.then(function(cb) {
   var roles = [];
    angular.forEach(cb.roles[0].role, function(value) {
      this.push(value.name);
    }, roles);
    $scope.canEdit = ['user', 'editor', 'admin'].filter(function(n) {
      return roles.indexOf(n) != -1;
    });
    $scope.canEdit = $scope.canEdit.length > 0 ? true : false;

  });








  if ($stateParams.name !== undefined) {

    WikiService.getPlantFamily($stateParams.name)
      .then(function (cb) {
        $scope.plantFamily = cb;

        if ($scope.plantFamily.plantFamilyVersion.length===0){
          $scope.acceptedVersions = false;
        }
        else {
          $scope.acceptedVersions = true;
          $scope.plantFamilyVersion = cb.plantFamilyVersion[0];

          delete $scope.plantFamily.plantFamilyVersion;



        }
        $timeout(function () {
          $scope.showCard = true;
        }, 100);

      });


  }







})


;

