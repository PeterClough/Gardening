angular.module( 'diary.view', [
  'ui.router',
  'pascalprecht.translate',
  'treeControl',
  'ui.bootstrap.showErrors',
  'ngAnimate',
  'angularFileUpload',
  'bootstrapLightbox',
  'angular-growl',
  'angular-confirm'
])


.config(function config( $stateProvider, showErrorsConfigProvider ) {

  $stateProvider.state( 'diary.view', {
    url: '/view/:diaryId/:type/:id',
    views: {
      "diary": {
        controller: 'DiaryViewCtrl',
        templateUrl: 'diary/view/view.tpl.html'
      }
    },
    params: {
      diaryId  : {
        value : ''
      },
      type  : {
        value : '',
        squash: true
      },
      id  : {
        value : '',
        squash: true
      }
    },
    data: {
      pageTitle: 'View My Diary',
      ogTitle: 'My Gardening Diary'
    }
  });

  showErrorsConfigProvider.showSuccess(true);

})


.controller('DiaryViewCtrl', function DiaryViewCtrl( $scope, $state, $filter, $translate, $timeout, $stateParams, growl, User, DiaryViewService,  FileUploader, Lightbox) {
  'use strict';


  $scope.showCard = false;
  $scope.loggedIn = User.isAuthenticated();
  $scope.userId = User.getCurrentId();
  $scope.diaryTreeData={};

  $scope.diaryTreeOptions = {
    nodeChildren: "diaryProgression",
    dirSelectable: true,
    allowDeselect: false,
    injectClasses: {
      ul: "a1",
      li: "a2",
      liSelected: "a7",
      iExpanded: "a3",
      iCollapsed: "a4",
      iLeaf: "a5",
      label: "a6",
      labelSelected: "a8"

    }
  };





  DiaryViewService.findByDiaryId($stateParams.diaryId)
    .then(function(diary){
      $scope.userProfile = diary.user;

      var selected = null;
      var expandNode = null;
      var entryCount = -1;
      angular.forEach(diary.diaryEntries, function(node){
        entryCount++;
        if (node.id === $stateParams.id){
          selected = node;
        }
        node.valid=true;
        angular.forEach(node.diaryProgression, function(node){
          if (node.id === $stateParams.id){
            selected = node;
            expandNode = entryCount;
            console.log('expandNode', expandNode);
          }
          node.valid=true;
        });
      });
      $scope.diaryTreeData = diary.diaryEntries;
      if (expandNode !== null) {
        $scope.expandedNodes = [$scope.diaryTreeData[expandNode]];
      }
      //set the diary node to first entry and trigger update to show form
      if($scope.diaryTreeData.length!==0){
        if (selected === null) {
          selected = $scope.diaryTreeData[$scope.diaryTreeData.length-1];
          console.log('selected', selected);
        }
        $scope.selected = selected;
        $scope.showSelected(selected);
      }
      $scope.showCard = true;

  });


  $scope.showSelected = function(sel) {
    $scope.images = [];

    if (typeof sel!='undefined') {

      $scope.isDiaryEntry = sel.hasOwnProperty('countryId');
      if ($scope.isDiaryEntry) {
        $scope.isDiaryProgress = false;
        $scope.diaryEntry = sel;
      }

      $scope.isDiaryProgress = sel.hasOwnProperty('diaryEntryId');
      if ($scope.isDiaryProgress) {
        $scope.isDiaryEntry = false;
        $scope.diaryProgress = sel;
      }
      $scope.loadImageDocs();
    }
  };


  $scope.loadImageDocs  = function () {

    if ($scope.isDiaryEntry &&  typeof $scope.diaryEntry.id!='undefined') {
      DiaryViewService.getIdsByDiaryEntryId($scope.diaryEntry.id)
        .then(function(diaryEntryImageIds){
          $scope.images = diaryEntryImageIds;
          if ($scope.images.length > 0){
            $state.current.data.ogImage = "http://www.gardensyjardines.com/#"+$scope.images[0].url;
            console.log('$state.current.data.ogImage',$state.current.data.ogImage);
          }
        });
    }
    if ($scope.isDiaryProgress &&  typeof $scope.diaryProgress.id!='undefined') {
      DiaryViewService.getIdsByDiaryProgressId($scope.diaryProgress.id)
        .then(function(diaryProgressImageIds){
          $scope.images = diaryProgressImageIds;
          if ($scope.images.length > 0){
            $state.current.data.ogImage = "http://www.gardensyjardines.com/#"+$scope.images[0].url;
            console.log('$state.current.data.ogImage',$state.current.data.ogImage);
          }
        });
    }
  };


  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.images, index);
  };


}) // end controller


.filter('max', function() {
  return function(input) {
    input = input || '';
    var out = 0;
    angular.forEach(input, function(value) {
      out = Math.max(out, value);
    });
    return out;
  };
})

.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (input[i].id == id) {
        return input[i];
      }
    }
    return null;
  };
})


.service('DiaryViewService', function DiaryViewService( $q, Diary, DiaryEntryImageDoc, DiaryProgressImageDoc ) {

  this.findByDiaryId = function(diaryId) {
    var deferred = $q.defer();


    Diary.findByDiaryId({"diaryId": diaryId})
      .$promise.then(function (cb) {
        var diary = cb.diary[0];
        deferred.resolve(diary);

    });

    return deferred.promise;
  };




  this.getIdsByDiaryEntryId = function(diaryEntryId) {
    var deferred = $q.defer();


    DiaryEntryImageDoc.getIdsByDiaryEntryId({"diaryEntryId": diaryEntryId})
      .$promise.then(function (cb) {
      var diaryEntryImageIds = cb.diaryEntryImageIds;
      angular.forEach(diaryEntryImageIds, function(image) {
        image.thumbUrl =  "api/diaryEntryImages/thumbs/download/"+ image.id + image.extension;
        image.url =  "api/diaryEntryImages/lightbox/download/"+ image.id + image.extension;
      });

      deferred.resolve(diaryEntryImageIds);

    });

    return deferred.promise;
  };




  this.getIdsByDiaryProgressId = function(diaryProgressId) {
    var deferred = $q.defer();


    DiaryProgressImageDoc.getIdsByDiaryProgressId({"diaryProgressId": diaryProgressId})
      .$promise.then(function (cb) {
      var diaryProgressImageIds = cb.diaryProgressImageIds;
      angular.forEach(diaryProgressImageIds, function(image) {
        image.thumbUrl =  "api/diaryProgressImages/thumbs/download/"+ image.id + image.extension;
        image.url =  "api/diaryProgressImages/lightbox/download/"+ image.id + image.extension;
      });

      deferred.resolve(diaryProgressImageIds);

    });

    return deferred.promise;
  };


})


;



