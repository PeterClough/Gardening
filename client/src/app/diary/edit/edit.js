angular.module( 'diary.edit', [
  'ui.router',
  'pascalprecht.translate',
  'treeControl',
  'ui.bootstrap.showErrors',
  'ngAnimate',
  'angularFileUpload',
  'bootstrapLightbox',
  'angular-growl',
  'angular-confirm',
  'ui.bootstrap.contextMenu'
])


.config(function config( $stateProvider, showErrorsConfigProvider ) {

  $stateProvider.state( 'diary.edit', {
    url: '/edit',
    views: {
      "diary": {
        controller: 'DiaryEditCtrl',
        templateUrl: 'diary/edit/edit.tpl.html'
      }
    },
    data: {
      pageTitle: 'My Diary',
      ogUrl: 'http://www.gardensyjardines.com/#/diary/edit/',
      ogType: 'website',
      ogTitle: 'Gardens y Jardines',
      ogDescription: 'A website all about gardening.',
      ogImage: 'http://www.gardensyjardines.com/images/gardensyjardines.png'
    }



});

  showErrorsConfigProvider.showSuccess(true);

})


.controller('DiaryEditCtrl', function DiaryEditCtrl( $scope, $rootScope, $filter, $translate, $q, $window, $confirm, $timeout, $location, $state, growl, User, DiaryService, DiaryEntry, DiaryEntryImageDoc, DiaryProgressImageDoc, saveDiaryEntry, saveDiaryProgress, FileUploader, Lightbox, ezfb, envService) {
  'use strict';



//  $state.get('diary.edit').data.ogImage = 'fred';

  $scope.showCard = false;
  $scope.loggedIn = User.isAuthenticated();
  $scope.userId = User.getCurrentId();
  $scope.diaryTreeData={};
  $scope.isDirty = false;
  $scope.showWikiDetails = false;
  $scope.plantFamilies = [];
  var languageId = '';
  var amazonS3Url = envService.read('amazonS3Url');


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



  if ($scope.loggedIn) {
    DiaryService.getDiary($scope.userId)
      .then(function(diary){
        var next ='';
        if (diary.length===0){
          next = $location.nextAfterDefaults || '/diary/create';
          $location.nextAfterDefaults = null;
          $location.path(next);
        }
        else if (!diary[0].diaryDefault){
          next = $location.nextAfterDefaults || '/diary/defaults';
          $location.nextAfterDefaults = null;
          $location.path(next);
        }
        else {
          $scope.diaryTreeData = diary[0].diaryEntries;
          $scope.diaryDefault = diary[0].diaryDefault;
          //set the diary node to first entry and trigger update to show form
          if($scope.diaryTreeData.length!==0){
            $scope.selected = $scope.diaryTreeData[$scope.diaryTreeData.length-1];
            $scope.showSelected($scope.diaryTreeData[$scope.diaryTreeData.length-1]);
            $scope.isNewDiary = false;
          }
          else {
            $scope.isNewDiary = true;
          }
          languageId = $rootScope.langageId;
          getDiaryData();
          $scope.showCard = true;
        }
      });
  }


  $scope.getPlantFamilies = function(search) {
    var newPFs = $scope.plantFamilies.slice();

    var elementPos = newPFs.map(function(x) {return x.id; }).indexOf(search);
    var objectFound = newPFs[elementPos];



    if (search && objectFound >= 0) {
      var newNode = {'name': search};
      newPFs.unshift(newNode);
    }
    return newPFs;
  };






  $scope.datepickerFormat = "dd-MMM-yyyy";

  $scope.openEntryEntryDate = function() {
    $scope.entryEntryDate.opened = true;
  };

  $scope.entryEntryDate = {
    opened: false
  };


  $scope.openProgressEntryDate = function() {
    $scope.progressEntryDate.opened = true;
  };

  $scope.progressEntryDate = {
    opened: false
  };



  ///// FIX THIS LATER
/**
    $scope.$on('$stateChangeStart', function( event ) {
      if ($scope.isDirty === true ){
        //TRANSLATE!!!!!
        $translate('UNSAVED_DATA_LEAVE_PAGE').then(function (translation) {
          var answer = confirm(translation);
          if (!!answer) {
            event.preventDefault();
          }
        });

      }
    });

**/


  $scope.$watch('frmDiaryEntry.$valid', function(newValue) {
    //$scope.valid = newVal;
    if (typeof $scope.diaryEntry!='undefined'){
      $scope.diaryEntry.valid = newValue;
    }
  });


  $scope.$watch('frmDiaryEntry.$dirty', function(newValue) {
     if (typeof newValue!='undefined') {
      if (typeof $scope.diaryEntry!='undefined') {
        $scope.diaryEntry.isDirty = newValue;
        if (newValue === true) {
          $scope.isDirty = true;
        }
      }
    }
  });

  $scope.$watch('frmDiaryProgress.$dirty', function(newValue) {
    if (typeof newValue!='undefined') {
      if (typeof $scope.diaryProgress!='undefined') {
        $scope.diaryProgress.isDirty = newValue;
        if (newValue === true) {
          $scope.isDirty = true;
        }
      }
    }
  });


  $scope.showSelected = function(sel) {
    $scope.images = [];

    if (typeof sel!='undefined') {

      if (!(sel.entryDate instanceof Date)) {
        sel.entryDate = new Date(moment.parseZone(sel.entryDate).format("L LT"));
      }

      $scope.isDiaryEntry = sel.hasOwnProperty('countryId');
      if ($scope.isDiaryEntry) {
        $scope.isDiaryProgress = false;

        $scope.plantFamilies = $scope.plantFamilies.filter(function( obj ) {
          return obj.id !== -1;
        });

        if (sel.plantFamilyId === -1) {
          $scope.plantFamilies.push({id:-1, name: sel.plantFamily});
        }


        $scope.diaryEntry = sel;

        $scope.frmDiaryEntry.$setPristine();
      }

      $scope.isDiaryProgress = sel.hasOwnProperty('diaryEntryId');
      if ($scope.isDiaryProgress) {
        $scope.isDiaryEntry = false;
        $scope.diaryProgress = sel;
        $scope.frmDiaryProgress.$setPristine();
      }
      $scope.loadImageDocs();
    }
  };







  $scope.refreshSelect = function ($select){

    var search = $select.search,
      list = angular.copy($select.items),
      FLAG = -1;
/*    if (search.length === 1 && search !== search.toUpperCase){
      $select.search = $filter('uppercase')(search);
    }
*/
    //remove last user input
    list = list.filter(function(item) {
      return item.id !== FLAG;
    });


    var inList = list.filter(function(item) {
      return item.name === search;
    });

    if (!search || inList.length !== 0) {
      //use the predefined list
      $select.items = list;
    }
    else {
      $scope.showWikiDetails = false;

      //manually add user input and set selection
      var userInputItem = {
        id: FLAG,
        name: search
      };
      $scope.diaryEntry.plantFamily = search;

      $select.items = [userInputItem].concat(list);
      $select.selected = userInputItem;
    }
  };

  $scope.clearSelect = function ($event, $select){
    $event.stopPropagation();
    //to allow empty field, in order to force a selection remove the following line
    $select.selected = undefined;
    //reset search query
    $select.search = undefined;
    //focus and open dropdown
    $select.activate();
  };


  $scope.plantFamilyCallback = function($item, $model) {
    if ($model !== -1){
      var index = $scope.plantFamilies.map(function(x) {return x.id; }).indexOf($model);
      $scope.diaryEntry.plantFamily = $scope.plantFamilies[index].name;

        DiaryService.getPlantFamilyVersion($model)
          .then(function(pFVersion){
            $scope.plantFamilyWiki = pFVersion;
            $scope.showWikiDetails = true;

          });

        }
  };



  $scope.dEPhotoOptions  = [
    ['Delete', function ($itemScope, $event, id) {


      $translate('DIARY_DELETE_PHOTO').then(function (translation) {
        $confirm({text: translation})
          .then(function(){
            DiaryEntryImageDoc.deleteImage({id: id})
              .$promise.then( function(success){
              var imageIndex = $scope.images.map(function(x) {return x.id; }).indexOf(id);
              $scope.images.splice(imageIndex,1);
            });
          });
      });
    }]
  ];


  $scope.dPPhotoOptions  = [
    ['Delete', function ($itemScope, $event, id) {


      $translate('DIARY_DELETE_PHOTO').then(function (translation) {
        $confirm({text: translation})
          .then(function(){
            DiaryProgressImageDoc.deleteImage({id: id})
              .$promise.then( function(success){
              var imageIndex = $scope.images.map(function(x) {return x.id; }).indexOf(id);
              $scope.images.splice(imageIndex,1);
            });
          });
      });
    }]
  ];



  $scope.addDiaryEntry = function() {
    $scope.$broadcast('show-errors-reset');

    var dENode = angular.copy($scope.diaryDefault);
    dENode.entryDate = new Date();
    dENode.diaryProgression = [];
    dENode.isPrivate = false;
    dENode.isDirty = true;
    dENode.plantRatingId = '';

    DiaryEntry.objectId()
      .$promise.then(function(res) {
        dENode.id = res.id;
        dENode.updated="";
        $scope.diaryTreeData.push(dENode);
        $scope.selected=dENode;
        $scope.showSelected(dENode);
      });

  };




  $scope.addDiaryProgress = function($event, node) {
    $scope.$broadcast('show-errors-reset');

    var dPNode = {};
    dPNode.entryDate = new Date();
    dPNode.valid = true;
    dPNode.isDirty = true;

    if (node.hasOwnProperty('countryId')) {
      dPNode.diaryEntryId=node.id;
      node.diaryProgression.push(dPNode);
      $scope.expandedNodes.push(node);
      $scope.selected=dPNode;
      $scope.showSelected(dPNode);
    }

    if (node.hasOwnProperty('diaryEntryId')) {

      var found = $filter('getById')($scope.diaryTreeData, node.diaryEntryId);
      if (found){
        dPNode.diaryEntryId=node.diaryEntryId;
        found.diaryProgression.push(dPNode);
        $scope.selected=dPNode;
        $scope.showSelected(dPNode);
      }
    }
  };

  $scope.save = function() {
    $scope.saveError = false;
    $scope.saveSuccess = false;
    $scope.isDirty=false;

    $scope.$broadcast('show-errors-check-validity');

    if ($scope.diaryTreeData.every(function(node){
        if (!node.valid){
          return false;
        }
        else {
          return true;
        }
      }))
    {
      var diaryProgression = [];
      var promises = [];

        $scope.diaryTreeData.forEach(function (node) {

          diaryProgression = node.diaryProgression;

          promises.push(saveDiaryEntry.save(node)
            .then(function (res) {
                $scope.isDirty = $scope.isDirty || res.isDirty;
             }));

          saveDiaryProgress.save(diaryProgression, node.id)
            .then(function (res) {
                $scope.isDirty = $scope.isDirty || res.isDirty;
            });
        });

      $q.all(promises).then(function(){
        if ($scope.isDirty===true) {
          $scope.isDirty=false;
          $scope.frmDiaryEntry.$setPristine();
          $scope.frmDiaryProgress.$setPristine();
          growl.success("DIARY_EDIT_SAVE_SUCCESS",{title: "GROWL_SAVED_TITLE"});

        }
        else {
          growl.info("DIARY_EDIT_SAVE_NOTHING",{title: "GROWL_INFO_TITLE"});
        }
      });

    }
    else {
      growl.error("DIARY_EDIT_SAVE_INVALID",{title: "GROWL_ERROR_TITLE"});
    }


  };






  $scope.deleteRow = function(sel) {


    var index;

    if (sel.diaryId !== undefined) {
      //is diary entry

      if (sel.created !== undefined) {
        //not persisted
        DiaryEntry.deleteEntry({entryId: sel.id})
          .$promise.then(function (cb) {
          });
      }
      index = $scope.diaryTreeData.indexOf(sel);
      $scope.diaryTreeData.splice(index,1);

      if ($scope.diaryTreeData.length===0) {
        $scope.selected = undefined;
        $scope.isDiaryEntry = $scope.isDiaryProgress = false;
        $scope.isNewDiary = true;
      }
      else if ($scope.diaryTreeData.length>index){
        $scope.selected = $scope.diaryTreeData[index];
      }
      else {
        $scope.selected = $scope.diaryTreeData[index-1];
      }
      $scope.showSelected($scope.selected);



    }
    else {
      var diaryProgressIds = [sel.id];
      if (sel.created !== undefined) {
        //not persisted
        DiaryProgress.deleteProgress({"id": diaryProgressIds, "isEntry": false})
          .$promise.then(function (cb) {
          });
      }

      var diaryEntry = $scope.diaryTreeData.filter(function ( diaryEntry ) {
        return diaryEntry.id === sel.diaryEntryId;
      })[0];

      index = diaryEntry.diaryProgression.indexOf(sel);
      diaryEntry.diaryProgression.splice(index,1);

      if (diaryEntry.diaryProgression.length===0) {
        $scope.selected = diaryEntry;
      }
      else if (diaryEntry.diaryProgression.length>index){
        $scope.selected = diaryEntry.diaryProgression[index];
      }
      else {
        $scope.selected = diaryEntry.diaryProgression[index-1];
      }
      $scope.showSelected($scope.selected);


    }


     // $scope.isDiaryEntry = $scope.isDiaryProgress = false;

    growl.success("DIARY_EDIT_DELETE_SUCCESS", {title: "GROWL_DELETED_TITLE"});
  };




        // create a uploader with options for Diary entry
    var uploader = $scope.uploader = new FileUploader ({
      scope: $scope,                          // to automatically update the html. Default: $rootScope
      url: '/api/diaryEntryImages/original/upload',
      progress: 100,
      formData: [
      ]
    });

    uploader.filters.push({
      name: 'customFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        return this.queue.length < 20;
      }
    });

// File must be jpeg or png
    uploader.filters.push({
      name: 'imageFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });


    // CALLBACKS

    uploader.onAfterAddingFile = function(fileItem) {

      DiaryEntryImageDoc.objectId(function(res){
        // rename file with the presupplied oid and add the extension
        fileItem.file.name = res.id + '.' + fileItem.file.name.split('.').pop();

      });

    };



    uploader.onCompleteItem = function(fileItem, response, status, headers) {


      var ddEIDate = moment.utc();
      var dEIDId = fileItem.file.name.substr(0, fileItem.file.name.lastIndexOf('.'));
      var diaryEntryImageDoc = {
        "id": dEIDId,
        "uploaded": ddEIDate,
        "updated": ddEIDate,
        "url": amazonS3Url + 'diary_entry/lightbox/' + dEIDId + '.png',
        "thumbUrl": amazonS3Url + 'diary_entry/thumbs/' + dEIDId + '.png',
        "comments": "",
        "extension": ".png",
        "diaryEntryId": $scope.diaryEntry.id
      };
      DiaryEntryImageDoc.upsert(diaryEntryImageDoc);
      var image = {};
      image.thumbUrl = diaryEntryImageDoc.thumbUrl;
      image.url =  diaryEntryImageDoc.url;
      image.id = dEIDId;
      $scope.images.unshift(image);

    };
    uploader.onCompleteAll = function() {
      uploader.clearQueue();

    };

    // create a uploader2 with options for Diary Progress
    var uploader2 = $scope.uploader2 = new FileUploader ({
      scope: $scope,                          // to automatically update the html. Default: $rootScope
      url: '/api/diaryProgressImages/original/upload',
      progress: 100,
      formData: [
      ]
    });

    uploader2.filters.push({
      name: 'customFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        return this.queue.length < 20;
      }
    });

// File must be jpeg or png
    uploader2.filters.push({
      name: 'imageFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });


    // CALLBACKS

    uploader2.onAfterAddingFile = function(fileItem) {

      DiaryProgressImageDoc.objectId(function(res){
        // rename file with the presupplied oid and add the extension
        fileItem.file.name = res.id + '.' + fileItem.file.name.split('.').pop();

      });

    };


    uploader2.onCompleteItem = function(fileItem, response, status, headers) {
      var ddPIDate = moment.utc();
      var dPIDId = fileItem.file.name.substr(0, fileItem.file.name.lastIndexOf('.'));
      var diaryProgressImageDoc = {
        "id": dPIDId,
        "uploaded": ddPIDate,
        "updated": ddPIDate,
        "url": amazonS3Url + 'diary_progress/lightbox/' + dPIDId + '.png',
        "thumbUrl": amazonS3Url + 'diary_progress/thumbs/' + dPIDId + '.png',
        "comments": "",
        "extension": ".png",
        "diaryProgressId": $scope.diaryProgress.id
      };
      DiaryProgressImageDoc.upsert(diaryProgressImageDoc);
      var image = {};
      image.thumbUrl =  diaryProgressImageDoc.thumbUrl;
      image.url =  diaryProgressImageDoc.url;
      image.id = dPIDId;
      $scope.images.unshift(image);

    };
    uploader2.onCompleteAll = function() {
      uploader2.clearQueue();

    };

    $scope.loadImageDocs  = function () {

    if ($scope.isDiaryEntry &&  typeof $scope.diaryEntry.id!='undefined') {
      DiaryEntryImageDoc.getIdsByDiaryEntryId({"diaryEntryId": $scope.diaryEntry.id})
        .$promise.then(function (cb) {
          $scope.images = cb.diaryEntryImageIds;
      });
    }
    if ($scope.isDiaryProgress &&  typeof $scope.diaryProgress.id!='undefined') {
      DiaryProgressImageDoc.getIdsByDiaryProgressId({"diaryProgressId": $scope.diaryProgress.id})
        .$promise.then(function (cb) {
          $scope.images = cb.diaryProgressImageIds;
        });
    }
  };


  $scope.fileDelete = function (index, id) {
    $http.delete('/api/diaryEventImages/original/files/' + encodeURIComponent(id)).success(function (data, status, headers) {
      $scope.files.splice(index, 1);
    });
  };

  $scope.$on('uploadCompleted', function(event) {
    // could attach the snippet here

//    $scope.loadImages();
  });

  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.images, index);
  };




  $scope.fbShare = function() {
    if (!!$scope.selected) {

      var picture = '';
      if (!!$scope.images) {
        picture = 'http://www.gardensyjardines.com/' + $scope.images[0].url;
      }

      var link = 'http://www.gardensyjardines.com/#/diary/view/' + $scope.userId + '/entry/' + $scope.selected.id;


      $translate('DIARY_ENTRY_FB_SHARE_CAPTION').then(function (translation) {

        ezfb.ui({
            method: 'feed',
            link: link,
            picture: picture,
            caption: translation
          })
          .$promise.then(function (cb) {
         });
      });
    }
  };









  function getDiaryData() {


    DiaryService.getDiaryData(languageId)
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

        cb[4].promise.then(function(cb2) {
          $scope.plantRatings = cb2;

          $scope.plantRating = {};
        });

        cb[5].promise.then(function(cb2) {
          $scope.plantFamilies = cb2;

          $scope.plantFamily = {};
        });

      });
  }






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


.factory('saveDiaryEntry', function($q, $filter, DiaryEntry) {

  var service = {};
  service.save = function(node) {

    var deferred = $q.defer();
    if (node.isDirty) {
      node.updated = moment.utc();
      if (node.created === undefined) {
        node.created = node.updated;
      }
      var saveNode = angular.copy(node);
      delete saveNode.isDirty;
      delete saveNode.valid;


      DiaryEntry.upsert(saveNode)
        .$promise.then(function(res) {
          deferred.resolve({isDirty:true});
          node.id = saveNode.id;
        });



      node.isDirty=false;
    }
    else {
      deferred.resolve({isDirty:false});
    }
    return deferred.promise;
  };
  return service;
})


.factory('saveDiaryProgress', function($q, $filter, DiaryProgress) {


  var service = {};
  service.save = function(diaryProgression, diaryEntryId) {

    var deferred = $q.defer();

    isDirty = false;

    diaryProgression.forEach(function (node) {
      if (node.isDirty) {
        node.updated = moment.utc();
        if (node.created === undefined) {
          node.created = node.updated;
        }

        var saveNode = angular.copy(node);
        delete saveNode.isDirty;
        delete saveNode.valid;
        if (saveNode.diaryEntryId === undefined) {
          saveNode.diaryEntryId = diaryEntryId;
        }

        DiaryProgress.upsert(saveNode)
          .$promise.then(function(res) {
            //success
            node.id = res.id;
          });
        node.isDirty=false;
        isDirty=true;
      }
      else {
      }
    });
    deferred.resolve({isDirty:isDirty});
    return deferred.promise;
  };

  return service;
})

.directive('ngThumb', function($window) {
  var helper = {
    support: !!($window.FileReader && $window.CanvasRenderingContext2D),
    isFile: function(item) {
      return angular.isObject(item) && item instanceof $window.File;
    },
    isImage: function(file) {
      var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  };

  return {
    restrict: 'A',
    template: '<canvas/>',
    link: function(scope, element, attributes) {
      if (!helper.support) {
        return;
      }

      var params = scope.$eval(attributes.ngThumb);

      if (!helper.isFile(params.file)) {
        return;
      }
      if (!helper.isImage(params.file)) {
        return;
      }

      var canvas = element.find('canvas');
      var reader = new FileReader();

      reader.onload = onLoadFile;
      reader.readAsDataURL(params.file);

      function onLoadFile(event) {
        var img = new Image();
        img.onload = onLoadImage;
        img.src = event.target.result;
      }

      function onLoadImage() {
        var width = params.width || this.width / this.height * params.height;
        var height = params.height || this.height / this.width * params.width;
        canvas.attr({ width: width, height: height });
        canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
      }
    }
  };
})



;
