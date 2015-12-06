/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(PlantRating){

  PlantRating.getList = function(cb) {
      PlantRating.find({ fields: {name: true, id: true} }, function(err, cb2) {
         cb(null, cb2);
    });
  };

  PlantRating.remoteMethod(
      'getList',
      {
        returns: {arg: 'plantRatings', type: 'object'}
      }
  );




}
