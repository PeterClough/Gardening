angular.module( 'myApp.diary', [
  'ui.router',
  'pascalprecht.translate',
  'diary.view',
  'diary.create',
  'diary.defaults',
  'diary.feed',
  'diary.edit'

])


.config(function config( $stateProvider ) {

  $stateProvider.state( 'diary', {
    url: '/diary',
    views: {
      "main": {
        controller: 'DiaryCtrl',
        templateUrl: 'diary/diary.tpl.html'
      }
    },
    data:{ pageTitle: 'Diary' }
  });
})

.controller( 'DiaryCtrl', function DiaryCtrl() {


})

.service('DiaryService', function DiaryService( $q,  Diary, Country, HardinessZone, SoilAcidity, SoilType, PlantRating ) {

  this.getDiary = function(userId) {

    var deferred = $q.defer();

    Diary.getDiary({"userId": userId})
      .$promise.then(function(cb){
      if (cb.diary.length>0) {
        angular.forEach(cb.diary[0].diaryEntries, function (node) {
          node.valid = true;
          angular.forEach(node.diaryProgression, function (node) {
            node.valid = true;
          });
        });
      }
      deferred.resolve(cb.diary);
    });

    return deferred.promise;

  };


  this.getDiaryData = function() {



    var deferred =[];
    var countries = $q.defer();
    var hardinessZones = $q.defer();
    var soilAcidities = $q.defer();
    var soilTypes = $q.defer();
    var plantRatings = $q.defer();
    deferred.push(countries);
    deferred.push(hardinessZones);
    deferred.push(soilAcidities);
    deferred.push(soilTypes);
    deferred.push(plantRatings);

    Country.getList()
      .$promise.then(function (cb) {
      countries.resolve(cb.countries);
    });

    HardinessZone.getList()
      .$promise.then(function (cb) {
      hardinessZones.resolve(cb.hardinessZones);
    });

    SoilAcidity.getList()
      .$promise.then(function (cb) {
      soilAcidities.resolve(cb.soilAcidities);
    });

    SoilType.getList()
      .$promise.then(function (cb) {
      soilTypes.resolve(cb.soilTypes);
    });

    PlantRating.getList()
      .$promise.then(function (cb) {
      plantRatings.resolve(cb.plantRatings);
    });

    return $q.all(deferred);


  };


  return {
    getDiary: this.getDiary,
    getDiaryData: this.getDiaryData
  };


})



;
