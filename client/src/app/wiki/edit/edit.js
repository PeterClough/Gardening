angular.module( 'wiki.edit', [
    'ui.router',
    'pascalprecht.translate',
    'ui.bootstrap.showErrors',
    'angular-growl',
    'checklist-model'
  ])

.config(function config( $stateProvider ) {

  $stateProvider.state( 'wiki.edit', {
    url: '/edit/:name',
    views: {
      "wiki": {
        controller: 'WikiEditCtrl',
        templateUrl: 'wiki/edit/edit.tpl.html'
      }
    },
    params: {
      name  : {
        value : ''
      }
    },
    data:{ pageTitle: 'Edit Wiki' }
  });
})

.controller( 'WikiEditCtrl', function WikiEditCtrl( $scope, $rootScope, $stateParams, $translate, $timeout, growl, User, UserService, WikiService ) {


  $scope.showCard = false;
  $scope.canEdit = true;
  $scope.loggedIn = User.isAuthenticated();
  var userId = User.getCurrentId();
  var languageId = '';
  $scope.saveSuccess = false;


  UserService.checkRoles($scope.userId, ['admin', 'editor', 'user'])
    .then(function(cb) {
    $scope.canEdit = cb.length > 0 ? true : false;

  });




  $rootScope.$on('$translateChangeSuccess', function () {
    $scope.showCard = false;
    languageId = $rootScope.languageId;
    if ( $stateParams.name === '' ) {
      $translate('CREATE_WIKI_HEADER').then(function (translation) {
        $scope.wikiHeader = translation;
      });
    }
    else {
      $translate('EDIT_WIKI_HEADER').then(function (translation) {
        $scope.wikiHeader = translation;
      });
    }
  });


  if (languageId !== undefined) {
    languageId = $rootScope.languageId;
    if ($stateParams.name === '') {
      $translate('CREATE_WIKI_HEADER').then(function (translation) {
        $scope.wikiHeader = translation;
      });
    }
    else {
      $translate('EDIT_WIKI_HEADER').then(function (translation) {
        $scope.wikiHeader = translation;
      });
    }
  }



//THINK ABOUT LANGUAGE CHANGE!!!!

  if ($scope.canEdit) {

    if ($stateParams.name === '') {

      $scope.editMode = false;

      $scope.plantFamily = {name: ''};
      $scope.plantFamilyVersion = {plantingAdvice: ''};
      $scope.pFPFVHelps = [];
      $scope.pFPFVHelpedBy = [];
      $scope.pFPFVBadFor = [];



      $timeout(function () {
        $scope.showCard = true;
      }, 100);


    }
    else {
      $scope.editMode = true;

      WikiService.getPlantFamily($stateParams.name)
        .then(function (cb) {



          $scope.plantFamily = cb;

          if ($scope.plantFamily.plantFamilyVersion.length === 0) {
            $scope.acceptedVersions = false;
            $timeout(function () {
              $scope.showCard = true;
            }, 100);

          }
          else {
            $scope.acceptedVersions = true;
            $scope.plantFamilyVersion = $scope.plantFamily.plantFamilyVersion[0];


            $scope.pFPFVHelps = [];
            angular.forEach($scope.plantFamilyVersion.helps, function (value) {


              this.push(value.id);
            }, $scope.pFPFVHelps);

            $scope.pFPFVHelpedBy = [];
            angular.forEach($scope.plantFamilyVersion.helpedBy, function (value) {


              this.push(value.id);
            }, $scope.pFPFVHelpedBy);

            $scope.pFPFVBadFor = [];
            angular.forEach($scope.plantFamilyVersion.badFor, function (value) {


              this.push(value.id);
            }, $scope.pFPFVBadFor);

            delete $scope.plantFamily.plantFamilyVersion;
            delete $scope.plantFamilyVersion.helps;
            delete $scope.plantFamilyVersion.helpedBy;
            delete $scope.plantFamilyVersion.badFor;

            $timeout(function () {
              $scope.showCard = true;
            }, 100);

          }
        });
    }


    WikiService.getPlantFamilyList(languageId)
      .then(function (cb) {

        //Remove own name

        $scope.plantFamilies = cb;


      });
  }



  $scope.savePlantFamily = function () {



    $scope.plantFamily.userId = $scope.plantFamilyVersion.authorId = userId;
    $scope.plantFamily.languageId = languageId;

    WikiService.savePlantFamily($scope.plantFamily, $scope.plantFamilyVersion, $scope.pFPFVHelps, $scope.pFPFVHelpedBy, $scope.pFPFVBadFor)
      .then(function(cb) {



        growl.success("WIKI_EDIT_SAVE_SUCCESS",{title: "GROWL_SAVED_TITLE"});

        $scope.saveSuccess = true;
        $scope.showCard = false;


      });

    };



})


;

