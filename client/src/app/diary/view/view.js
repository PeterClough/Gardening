angular.module( 'diary.view', [
  'ui.router',
  'pascalprecht.translate',
  'treeControl',
  'ui.bootstrap.showErrors',
  'ngAnimate'
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


.controller( 'DiaryViewCtrl', function DiaryViewCtrl( $scope, $filter, $translate, $location, $q, User, Diary, DiaryDefault, DiaryEntry, Country, HardinessZone, SoilAcidity, SoilType, PlantRating, saveDiaryEntry, saveDiaryProgress) {


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
    if (typeof $scope.diaryEntry!='undefined'){
      $scope.diaryEntry.valid = newVal;
      console.log('$scope.diaryEntry.valid');
      console.log($scope.diaryEntry.valid);
    }
  });


  $scope.$watch('frmDiaryEntry.$dirty', function(newValue) {
    console.log('In frmDiaryEntry.$dirty: '+newValue);

    if (typeof newValue!='undefined') {
      console.log("newValue: "+newValue);
      console.log("$scope.diaryEntry: "+$scope.diaryEntry);

      if (typeof $scope.diaryEntry!='undefined') {
        $scope.diaryEntry.isDirty = newValue;
        console.log($scope.diaryEntry.id+' diaryEntryDirty= '+$scope.diaryEntry.isDirty);
      }
    }
  });

  $scope.$watch('frmDiaryProgress.$dirty', function(newValue) {
    console.log('In frmDiaryProgress.$dirty: '+newValue);

    if (typeof newValue!='undefined') {
      console.log("newValue: "+newValue);
      console.log("$scope.diaryProgress: "+$scope.diaryProgress);

      if (typeof $scope.diaryProgress!='undefined') {
        $scope.diaryProgress.isDirty = newValue;
        console.log($scope.diaryProgress.id+' diaryProgressDirty= '+$scope.diaryProgress.isDirty);
      }
    }
  });




  $scope.showSelected = function(sel) {
    console.log('showSelected fired');
    $scope.saveSuccess = false;
    $scope.saveError = false;

    if (typeof sel!='undefined') {
      console.log(sel);

      $scope.isDiaryEntry = sel.hasOwnProperty('countryId');
      if ($scope.isDiaryEntry) {
        $scope.diaryEntry = sel;
        $scope.frmDiaryEntry.$setPristine();
      }

      $scope.isDiaryProgress = sel.hasOwnProperty('diaryEntryId');
      if ($scope.isDiaryProgress) {
        $scope.diaryProgress = sel;
        $scope.frmDiaryProgress.$setPristine();
      }
    }
  };


  $scope.addDiaryEntry = function() {

    var newNode = angular.copy($scope.diaryDefault);
    newNode[0].entryDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    newNode[0].children =[];
    newNode[0].isDirty =true;


    DiaryEntry.objectId()
      .$promise.then(function(res) {
        console.log('res.id');
        console.log(res.id);
        newNode[0].id = res.id;

        $scope.diaryTreeData.push(newNode[0]);
        $scope.selected=newNode[0];
        $scope.showSelected(newNode[0]);

        console.log('$scope.diaryTreeData');
        console.log($scope.diaryTreeData);
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

      var saveNode = angular.copy(node);
      delete saveNode.isDirty;
      delete saveNode.children;
      delete saveNode.valid;

      saveNode.updated = $filter('date')(new Date(), 'yyyy-MM-dd');

      DiaryEntry.upsert(saveNode)
        .$promise.then(function(res) {
          deferred.resolve({isDirty:true});
          console.log("Diary Entry " + saveNode.id + " Saved ");
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
        var saveNode = angular.copy(node);
        delete saveNode.isDirty;
        delete saveNode.valid;
        saveNode.updated = $filter('date')(new Date(), 'yyyy-MM-dd');
        if (saveNode.diaryEntryId === undefined) {
          saveNode.diaryEntryId = diaryEntryId;
          console.log("set child diaryEntryId :" + saveNode.diaryEntryId);
        }

        DiaryProgress.upsert(saveNode)
          .$promise.then(function(res) {
            //success
            console.log("Diary Progress " + res.id + " Saved ");

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


;



