angular.module( 'myApp.wiki', [
    'ui.router',
    'pascalprecht.translate',
    'wiki.edit',
    'wiki.list',
    'wiki.view'
  ])


.config(function config( $stateProvider ) {

  $stateProvider.state( 'wiki', {
    url: '/wiki',
    views: {
      "main": {
        controller: 'WikiCtrl',
        templateUrl: 'wiki/wiki.tpl.html'
      }
    },
    data:{ pageTitle: 'Wiki' }
  });
})

.controller( 'WikiCtrl', function WikiCtrl() {


})


.service('WikiService', function WikiService( $q, PlantFamily, PlantFamilyVersion, PFPFVHelpsJunction, PFPFVHelpedByJunction, PFPFVBadForJunction ) {

  this.getPlantFamilyList = function(languageId) {

    var deferred = $q.defer();

    PlantFamily.getList({"languageId": languageId})
      .$promise.then(function(cb){
      deferred.resolve(cb.plantFamilies);
    });


    return deferred.promise;


  };


  this.getPlantFamily = function(plantFamilyName) {

    var deferred = $q.defer();

    PlantFamily.getPlantFamily({"plantFamilyName": plantFamilyName})
      .$promise.then(function(cb){
      deferred.resolve(cb.plantFamily[0]);
    });


    return deferred.promise;


  };


  this.savePlantFamily = function(plantFamily, plantFamilyVersion, pFPFVHelps, pFPFVHelpedBy, pFPFVBadFor) {

    var deferred = $q.defer();

    plantFamilyVersion.state = 0; //pending



    if (typeof plantFamily.id === "undefined") {

      plantFamily.created = plantFamily.updated = plantFamilyVersion.created = plantFamilyVersion.updated = Date.now();

      PlantFamily.upsert(plantFamily)
        .$promise.then(function (cb) {



        plantFamilyVersion.plantFamilyId = cb.id;






        savePlantFamilyVersion(plantFamilyVersion, pFPFVHelps, pFPFVHelpedBy, pFPFVBadFor)
        .then(function (cb) {
          deferred.resolve(cb);
        });

      });
    }
    else {

      delete plantFamilyVersion.id; // need to make new version.

      plantFamily.updated = plantFamilyVersion.updated = Date.now();
      plantFamilyVersion.plantFamilyId = plantFamily.id;

      savePlantFamilyVersion(plantFamilyVersion, pFPFVHelps, pFPFVHelpedBy, pFPFVBadFor)
        .then(function (cb) {
        deferred.resolve(cb);
      });


    }

    return deferred.promise;


  };


 var savePlantFamilyVersion = function (plantFamilyVersion, pFPFVHelps, pFPFVHelpedBy, pFPFVBadFor) {

    var qPFV = $q.defer();
    var versions = [qPFV.promise];
    var pFVId = '';
    var joinData = [];

    PlantFamilyVersion.upsert(plantFamilyVersion)
      .$promise.then(function (cb) {
      qPFV.resolve(cb);
      pFVId = cb.id;






      if (pFPFVHelps.length>0){

        angular.forEach(pFPFVHelps, function(value) {
          var pFPFVHelpsPromise = $q.defer();
          versions.push(pFPFVHelpsPromise.promise);
          joinData ='{ "plantFamilyId": "' +  value + '", "plantFamilyVersionId": "' + pFVId + '"}';
          PFPFVHelpsJunction.upsert(joinData)
            .$promise.then(function (cb) {
            pFPFVHelpsPromise.resolve(cb);
          });
        });

      }


      if (pFPFVHelpedBy.length>0){

        angular.forEach(pFPFVHelpedBy, function(value) {
          var pFPFVHelpedByPromise = $q.defer();
          versions.push(pFPFVHelpedByPromise.promise);
          joinData ='{ "plantFamilyId": "' +  value + '", "plantFamilyVersionId": "' + pFVId + '"}';
          PFPFVHelpedByJunction.upsert(joinData)
            .$promise.then(function (cb) {
            pFPFVHelpedByPromise.resolve(cb);
          });
        });


      }


      if (pFPFVBadFor.length>0){

        angular.forEach(pFPFVBadFor, function(value) {
          var pFPFVBadForPromise = $q.defer();
          versions.push(pFPFVBadForPromise.promise);
          joinData ='{ "plantFamilyId": "' +  value + '", "plantFamilyVersionId": "' + pFVId + '"}';
          PFPFVBadForJunction.upsert(joinData)
            .$promise.then(function (cb) {
            pFPFVBadForPromise.resolve(cb);
          });
        });

      }





    });


   return $q.all(versions);

  };



  return {
    getPlantFamilyList: this.getPlantFamilyList,
    getPlantFamily: this.getPlantFamily,
    savePlantFamily: this.savePlantFamily
  };





})


;
