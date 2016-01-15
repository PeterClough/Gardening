/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(SoilType){

  SoilType.getList = function(cb) {
    SoilType.find({ fields: ['name', 'id'] }, function(err, cb2) {
         cb(null, cb2);
    });
  };

  SoilType.remoteMethod(
      'getList',
      {
        returns: {arg: 'soilTypes', type: 'object'}
      }
  );




}
