/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(Country){

  Country.getList = function(cb) {
      Country.find({ fields: {name: true, id: true} }, function(err, cb2) {
         cb(null, cb2);
    });
  };

  Country.remoteMethod(
      'getList',
      {
        returns: {arg: 'countries', type: 'object'}
      }
  );




}