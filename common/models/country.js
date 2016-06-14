/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(Country){

  Country.getList = function(cb) {
      Country.find({ order: "translateKey ASC",
                     fields: ['translateKey', 'id'] },
                     function(err, cb2) {
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
