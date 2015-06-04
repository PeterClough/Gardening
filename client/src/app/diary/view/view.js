/*jshint scripturl:true*/
angular.module( 'diary.view', [
  'ui.router',
  'pascalprecht.translate',
  'treeControl',
  'ui.bootstrap.showErrors',
  'ngAnimate',
  'angularFileUpload',
  'bootstrapLightbox'
])


.config(function config( $stateProvider, showErrorsConfigProvider ) {

  $stateProvider.state( 'diary.view', {
    url: '/view',
    views: {
      "diary": {
        controller: 'DiaryViewCtrl',
        templateUrl: 'diary/view/view.tpl.html'
      }
    },
    data:{ pageTitle: 'View Diary' }
  });

  showErrorsConfigProvider.showSuccess(true);

})


.controller('DiaryViewCtrl', function DiaryViewCtrl( $scope, $filter, $translate, $location, $q, $window, User, Diary, DiaryDefault, DiaryEntry, DiaryEntryImageDoc, DiaryProgressImageDoc, Country, HardinessZone, SoilAcidity, SoilType, PlantRating, saveDiaryEntry, saveDiaryProgress, MyUploader, Lightbox) {
  'use strict';


  $scope.showCard = false;
  $scope.loggedIn = User.isAuthenticated();
  $scope.userId = User.getCurrentId();
    console.log('getCurrentId:'+$scope.userId+' '+typeof($scope.userId));
  $scope.saveSuccess = false;
  $scope.diaryTreeData={};

  $scope.diaryTreeOptions = {
    nodeChildren: "children",
    dirSelectable: true,
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
  console.log('$scope.userId:' + $scope.userId);
  Diary.findByUserId({"userId":$scope.userId})
    .$promise.then(function (cb) {
      console.log("diary success");
      console.log(cb);
      if (cb.diary.length===0){
        console.log('diary undefined');

        var next = $location.nextAfterDefaults || '/diary/create';
        $location.nextAfterDefaults = null;
        $location.path(next);
      }
      else {
        DiaryDefault.findByDiaryId({"diaryId":$scope.userId})
          .$promise.then(function (cb) {
            console.log("defaults success");
            console.log(cb.diaryDefault);
            if (cb.diaryDefault.length===0){
              var next = $location.nextAfterDefaults || '/diary/defaults';
              $location.nextAfterDefaults = null;
              $location.path(next);
            }
            else {
              $scope.diaryDefault = cb.diaryDefault;
              //Need to remove id before copy to new diaryEntry later.
  //              delete $scope.diaryDefault[0].id;
              console.log("diaryDefault");
              DiaryEntry.findByDiaryId({"diaryId":$scope.userId})
                .$promise.then(function (cb) {
                  console.log("entries success");
                  console.log(cb.diaryEntries);
                  angular.forEach(cb.diaryEntries, function(node){
                    node.valid=true;
                    node.children = node.diaryProgression;
                    delete node.diaryProgression;
                    angular.forEach(node.children, function(node){
                      node.valid=true;
                    });
                  });
                  $scope.diaryTreeData = cb.diaryEntries;

                  //set the diary node to first entry and trigger update to show form
                  if($scope.diaryTreeData.length!==0){
                    $scope.selected = $scope.diaryTreeData[0];
                  $scope.showSelected($scope.diaryTreeData[0]);
                    $scope.isNewDiary = false;
                    $scope.showCard = true;
                  }
                  else {
                    $scope.isNewDiary = true;
                    $scope.showCard = true;
                  }


                  Country.getList()
                    .$promise.then(function (cb) {
                      $scope.countries = cb.countries;
                      $scope.country = {};
                    });

                  HardinessZone.getList()
                    .$promise.then(function (cb) {
                      $scope.hardinessZones = cb.hardinessZones;
                      $scope.hardinessZone = {};
                    });

                  SoilAcidity.getList()
                    .$promise.then(function (cb) {
                      $scope.soilAcidities = cb.soilAcidities;
                      $scope.soilAcidity = {};
                    });

                  SoilType.getList()
                    .$promise.then(function (cb) {
                      $scope.soilTypes = cb.soilTypes;
                      $scope.soilType = {};
                    });

                  PlantRating.getList()
                    .$promise.then(function (cb) {
                      $scope.plantRatings = cb.plantRatings;
                      $scope.plantRating = {};
                    });
              });
            }
          });
      }
    });
  }




  $scope.$watch('frmDiaryEntry.$valid', function(newVal) {
    //$scope.valid = newVal;
    console.log('frmDiaryEntry.$valid.newVal', newVal);
    if (typeof $scope.diaryEntry!='undefined'){
      $scope.diaryEntry.valid = newVal;
      console.log('$scope.diaryEntry.valid', $scope.diaryEntry.valid);
    }
  });


  $scope.$watch('frmDiaryEntry.$dirty', function(newValue) {
    console.log('In frmDiaryEntry.$dirty: ', newValue);

    if (typeof newValue!='undefined') {
      console.log("newValue: "+newValue);
      console.log("$scope.diaryEntry: ",$scope.diaryEntry);

      if (typeof $scope.diaryEntry!='undefined') {
        $scope.diaryEntry.isDirty = newValue;
        console.log($scope.diaryEntry.id+' diaryEntryDirty= ',$scope.diaryEntry.isDirty);
      }
    }
  });

  $scope.$watch('frmDiaryProgress.$dirty', function(newValue) {
    console.log('In frmDiaryProgress.$dirty: '+newValue);

    if (typeof newValue!='undefined') {
      console.log("newValue: "+newValue);
      console.log("$scope.diaryProgress: ",$scope.diaryProgress);

      if (typeof $scope.diaryProgress!='undefined') {
        $scope.diaryProgress.isDirty = newValue;
        console.log($scope.diaryProgress.id+' diaryProgressDirty= ',$scope.diaryProgress.isDirty);
      }
    }
  });




  $scope.showSelected = function(sel) {
    console.log('showSelected fired');
    $scope.images = [];
    $scope.saveSuccess = false;
    $scope.saveError = false;

    if (typeof sel!='undefined') {
      console.log(sel);

      $scope.isDiaryEntry = sel.hasOwnProperty('countryId');
      if ($scope.isDiaryEntry) {
        $scope.isDiaryProgress = false;
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


  $scope.addDiaryEntry = function() {

    console.log('$scope.diaryDefault', $scope.diaryDefault);

    var newNode = angular.copy($scope.diaryDefault);
    newNode[0].entryDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    newNode[0].children =[];
    newNode[0].isDirty =true;


    DiaryEntry.objectId()
      .$promise.then(function(res) {
        console.log('res.id');
        console.log(res.id);
        newNode[0].id = res.id;
        newNode[0].updated="";

        $scope.diaryTreeData.push(newNode[0]);
        $scope.selected=newNode[0];
        $scope.showSelected(newNode[0]);

        console.log('$scope.diaryTreeData',$scope.diaryTreeData);
      });

  };




  $scope.addDiaryProgress = function($event, node) {

    var newNode = {
      "entryDate": $filter('date')(new Date(), 'yyyy-MM-dd'),
      "isDirty": true,
      "valid":true
    };

    if (node.hasOwnProperty('countryId')) {
      newNode.diaryEntryId=node.id;
      node.children.push(newNode);
      $scope.expandedNodes.push(node);
      $scope.selected=newNode;
      $scope.showSelected(newNode);
    }

    if (node.hasOwnProperty('diaryEntryId')) {
      console.log('finding diaryEntryId :'+node.diaryEntryId);
      console.log('$scope.diaryTreeData :');
      console.log($scope.diaryTreeData);


      var found = $filter('getById')($scope.diaryTreeData, node.diaryEntryId);
      if (found){
        newNode.diaryEntryId=node.diaryEntryId;
        console.log(newNode);
        found.children.push(newNode);
        $scope.selected=newNode;
        $scope.showSelected(newNode);
      }
      else{console.log("not found");}
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


      var children = [];

      var promises = [];

        $scope.diaryTreeData.forEach(function (node) {
          var savedEntry = {};
          var savedProgress = {};

          children = node.children;

          promises.push(saveDiaryEntry.save(node)
            .then(function (res) {
              $scope.isDirty = $scope.isDirty || res.isDirty;
              console.log('Promises Entry id: '+node.id);
              console.log('res.isDirty: '+res.isDirty);
              console.log('$scope.isDirty: '+$scope.isDirty);
            }));

          saveDiaryProgress.save(children, node.id)
            .then(function (res) {
              $scope.isDirty = $scope.isDirty || res.isDirty;
              console.log('Promises Progress id: '+node.id);
              console.log('res.isDirty: '+res.isDirty);
              console.log('$scope.isDirty: '+$scope.isDirty);
            });
        });

      $q.all(promises).then(function(){

        console.log('isDirty outside then()'+$scope.isDirty);

        if ($scope.isDirty===true) {
          console.log("save finished, setting pristine");
          $scope.frmDiaryEntry.$setPristine();
          $scope.frmDiaryProgress.$setPristine();
          $translate('DIARY_VIEW_SAVE_SUCCESS').then(function (text) {
            console.log("save text translated: "+text);
            $scope.saveSuccessText = text;
            $scope.saveSuccess = true;
          });
        }
        else {
          $translate('DIARY_VIEW_SAVE_NOTHING').then(function (text) {
            $scope.saveErrorText = text;
            $scope.saveError = true;
          });

        }
      });

    }
    else {
      $translate('DIARY_VIEW_SAVE_INVALID').then(function (text) {
        $scope.saveErrorText = text;
        $scope.saveError = true;
      });
    }


  };



    // create a uploader with options for Diary entry
    var uploader = $scope.uploader = new MyUploader ({
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
      var diaryEntryImageDoc = {
        "id": fileItem.file.name.substr(0, fileItem.file.name.lastIndexOf('.')),
        "uploaded": $filter('date')(new Date(), 'yyyy-MM-dd'),
        "updated": $filter('date')(new Date(), 'yyyy-MM-dd'),
        "comments": "",
        "extension": "."+fileItem.file.name.split('.').pop(),
        "diaryEntryId": $scope.diaryEntry.id
      };
      DiaryEntryImageDoc.upsert(diaryEntryImageDoc);
      var image = {};
      image.thumbUrl =  "api/diaryEntryImages/thumbs/download/"+ fileItem.file.name;
      image.url =  "api/diaryEntryImages/lightbox/download/"+ fileItem.file.name;
      $scope.images.unshift(image);

    };
    uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
      uploader.clearQueue();

    };

    console.info('uploader', uploader);


    // create a uploader2 with options for Diary Progress
    var uploader2 = $scope.uploader2 = new MyUploader ({
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
      var diaryProgressImageDoc = {
        "id": fileItem.file.name.substr(0, fileItem.file.name.lastIndexOf('.')),
        "uploaded": $filter('date')(new Date(), 'yyyy-MM-dd'),
        "updated": $filter('date')(new Date(), 'yyyy-MM-dd'),
        "comments": "",
        "extension": "."+fileItem.file.name.split('.').pop(),
        "diaryProgressId": $scope.diaryProgress.id
      };
      DiaryProgressImageDoc.upsert(diaryProgressImageDoc);
      var image = {};
      image.thumbUrl =  "api/diaryProgressImages/thumbs/download/"+ fileItem.file.name;
      image.url =  "api/diaryProgressImages/lightbox/download/"+ fileItem.file.name;
      $scope.images.unshift(image);

    };
    uploader2.onCompleteAll = function() {
      console.info('onCompleteAll');
      uploader2.clearQueue();

    };

    console.info('uploader2', uploader2);




    $scope.loadImageDocs  = function () {

    if ($scope.isDiaryEntry &&  typeof $scope.diaryEntry.id!='undefined') {
      console.log('getting DiaryEntryImageDoc', $scope.diaryEntry.id);
      DiaryEntryImageDoc.getIdsByDiaryEntryId({"diaryEntryId": $scope.diaryEntry.id})
        .$promise.then(function (cb) {
          console.log(JSON.stringify(cb.diaryEntryImageIds));
          $scope.images = cb.diaryEntryImageIds;
          angular.forEach($scope.images, function(image) {
            image.thumbUrl =  "api/diaryEntryImages/thumbs/download/"+ image.id + image.extension;
            image.url =  "api/diaryEntryImages/lightbox/download/"+ image.id + image.extension;
          });
        });
    }
    if ($scope.isDiaryProgress &&  typeof $scope.diaryProgress.id!='undefined') {
      console.log('getting DiaryProgressImageDoc', $scope.diaryProgress.id);
      DiaryProgressImageDoc.getIdsByDiaryProgressId({"diaryProgressId": $scope.diaryProgress.id})
        .$promise.then(function (cb) {
          console.log(cb.diaryProgressImageIds);
          $scope.images = cb.diaryProgressImageIds;
          angular.forEach($scope.images, function(image) {
            image.thumbUrl =  "api/diaryProgressImages/thumbs/download/"+ image.id + image.extension;
            image.url =  "api/diaryProgressImages/lightbox/download/"+ image.id + image.extension;
          });

        });
    }
  };




  $scope.fileDelete = function (index, id) {
    $http.delete('/api/diaryEventImages/original/files/' + encodeURIComponent(id)).success(function (data, status, headers) {
      $scope.files.splice(index, 1);
    });
  };

  $scope.$on('uploadCompleted', function(event) {
    console.log('uploadCompleted event received');

   // could attach the snippet here

//    $scope.loadImages();
  });

  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.images, index);
  };


  }) // end controller





.directive('dateDirective', function($filter) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelController) {
      ngModelController.$parsers.push(function(data) {
        //convert data from view format to model format
        return data; //converted
      });

      ngModelController.$formatters.push(function(data) {
        //convert data from model format to view format
        return $filter('date')(data, "d-MMM-yyyy"); //converted
      });
    }
  };
})

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
      console.log('input:'+i);
      console.log(input[i]);
      console.log(+input[i].id);
      console.log(+id);

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
    console.log(node);

    if (node.isDirty) {
      console.log('isDirty inside saveDiaryEntry: ' + node.isDirty);
      console.log(node);

      node.updated = $filter('date')(new Date(), 'yyyy-MM-dd');

      var saveNode = angular.copy(node);
      delete saveNode.isDirty;
      delete saveNode.children;
      delete saveNode.valid;


      DiaryEntry.upsert(saveNode)
        .$promise.then(function(res) {
          deferred.resolve({isDirty:true});
          console.log("Diary Entry " + saveNode.id + " Saved ");
          node.id = saveNode.id;
        });



      node.isDirty=false;
    }
    else {
      console.log("returning saveDiaryEntry isDirty false: "+node.id);
      deferred.resolve({isDirty:false});
    }
    return deferred.promise;
  };
  return service;
})


.factory('saveDiaryProgress', function($q, $filter, DiaryProgress) {


  var service = {};
  service.save = function(children, diaryEntryId) {

    var deferred = $q.defer();

    isDirty = false;

    children.forEach(function (node) {
      console.log("in child");
      console.log(node);
      if (node.isDirty) {
        console.log("progression isdirty id: "+node.id);
        node.updated = $filter('date')(new Date(), 'yyyy-MM-dd');
        var saveNode = angular.copy(node);
        delete saveNode.isDirty;
        delete saveNode.valid;
        if (saveNode.diaryEntryId === undefined) {
          saveNode.diaryEntryId = diaryEntryId;
          console.log("set child diaryEntryId :" + saveNode.diaryEntryId);
        }

        DiaryProgress.upsert(saveNode)
          .$promise.then(function(res) {
            //success
            console.log("Diary Progress Saved :" , res.id);
            node.id = res.id;

          });
        node.isDirty=false;
        isDirty=true;
      }
      else {
        console.log("progression not isdirty "+diaryEntryId);
      }
    });
    console.log("progression returning isDirty: "+isDirty);
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



.factory('MyUploader', function(FileUploader) {
  // The inheritance. See https://github.com/nervgh/angular-file-upload/blob/v1.0.2/src/module.js#L686
  FileUploader.inherit(MyUploader, FileUploader);

    function MyUploader(options) {
      MyUploader.super_.apply(this, arguments);
    }


    MyUploader.prototype._getTotalProgress = function(value) {
      if(this.removeAfterUpload) {
        return value || 0;
      }

      var notUploaded = this.getNotUploadedItems().length;
      var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
      var ratio = 100 / this.queue.length;
      var current = (value || 0) * ratio / 100;
      if (this.queue.length===0){
        return 100;
      }
      return Math.round(uploaded * ratio + current);
    };


    return MyUploader;
})



;



