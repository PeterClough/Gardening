/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(HardinessZone){

  HardinessZone.getList = function(cb) {
      HardinessZone.find({ fields: {name: true, id: true} }, function(err, cb2) {
         cb(null, cb2);
    });
  };

  HardinessZone.remoteMethod(
      'getList',
      {
        returns: {arg: 'hardinessZones', type: 'object'}
      }
  );




}
