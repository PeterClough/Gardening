/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(SoilAcidity){

  SoilAcidity.getList = function(cb) {
      SoilAcidity.find({ fields: ['name', 'id'] }, function(err, cb2) {
         cb(null, cb2);
    });
  };

  SoilAcidity.remoteMethod(
      'getList',
      {
        returns: {arg: 'soilAcidities', type: 'object'}
      }
  );




}
