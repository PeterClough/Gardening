angular.module( 'admin.wiki', [
  'ui.router',
    'admin.wiki.list',
    'admin.wiki.review'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'admin.wiki', {
    url: '/wiki',
    views: {
      "admin": {
        controller: 'WikiCtrl',
        templateUrl: 'admin/wiki/wiki.tpl.html'
      }
    },
    data:{ pageTitle: 'Wiki' }
  });
})

.controller( 'WikiCtrl', function WikiCtrl( ) {

})



.service('AdminWikiService', function AdminWikiService( $q, PlantFamily, PlantFamilyVersion) {

  this.getPlantFamilyReviewList = function (languageId) {

    var deferred = $q.defer();

    PlantFamily.getReviewList({"languageId": languageId})
      .$promise.then(function(cb){
      deferred.resolve(cb.plantFamilyReviews);
    });

    return deferred.promise;

  };

  this.getPlantFamilyVersionReview = function (id) {

    var deferred = $q.defer();

    PlantFamilyVersion.getPlantFamilyVersionReview({"id": id})
      .$promise.then(function(cb){

      deferred.resolve(cb.plantFamilyVersions);
    });

    return deferred.promise;

  };



  this.acceptReview = function (plantFamilyVersion, currentId) {

    var updated = Date.now();
    var versions = [];
    if (currentId !== '') {

      var currentVersion = $q.defer();
      versions.push(currentVersion);


      PlantFamilyVersion.prototype$updateAttributes(
        {id: currentId},
        {state: -2, updated: updated},
        function (info, err) {
          if (typeof err !='function') {
            currentVersion.reject(err);
          }
          else {
            currentVersion.resolve(info);

            var reviewVersion = $q.defer();
            versions.push(reviewVersion);

            PlantFamilyVersion.prototype$updateAttributes(
              {id :plantFamilyVersion.id},
              {state: 1,
                updated: updated,
                reviewNotes: plantFamilyVersion.reviewNotes
              },
              function(info, err) {
                if (typeof err !='function') {
                  reviewVersion.reject(err);
                }
                else {
                  reviewVersion.resolve(info);
                }
              });
    }
        });

    }
    else {
      var reviewVersion = $q.defer();
      versions.push(reviewVersion);

      PlantFamilyVersion.prototype$updateAttributes(
        {id :plantFamilyVersion.id},
        {state: 1,
          updated: updated,
          reviewNotes: plantFamilyVersion.reviewNotes
        },
        function(info, err) {
          if (typeof err !='function') {
            reviewVersion.reject(err);
          }
          else {
            reviewVersion.resolve(info);
          }
        });
    }


    return $q.all(versions);

    //email the author with the reviewNotes and translate constant.

  };

  this.rejectReview = function (plantFamilyVersion) {
    //update attributes pfv set state -1 add reviewNotes
    //email the author with the reviewNotes and translate constant.



    var updated = Date.now();
    var reviewVersion = $q.defer();


    PlantFamilyVersion.prototype$updateAttributes(
      {id :plantFamilyVersion.id},
      {state: -1,
        updated: updated,
        reviewNotes: plantFamilyVersion.reviewNotes
      },
      function(info, err) {
        if (typeof err !='function') {
          reviewVersion.reject(err);
        }
        else {
          reviewVersion.resolve(info);
        }
      });


    return reviewVersion.promise;

      //email the author with the reviewNotes and translate constant.





  };

  return {
    getPlantFamilyReviewList: this.getPlantFamilyReviewList,
    getPlantFamilyVersionReview: this.getPlantFamilyVersionReview,
    acceptReview: this.acceptReview,
    rejectReview: this.rejectReview
  };

})


;
